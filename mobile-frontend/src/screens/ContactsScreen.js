import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getContacts } from "../services/api";
import ScreenContainer from "../components/ScreenContainer";
import { COLORS } from "../utils/constants";

export default function ContactsScreen() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  const fetchContacts = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await getContacts();
      setContacts(data);
      setFilteredContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.role.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [search, contacts]);

  const getAvatarUri = (url) => {
    if (!url || url === "null") return null;
    if (url.startsWith("http") || url.startsWith("data:image")) return url;
    const { API_BASE_URL } = require("../services/api");
    return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const renderItem = ({ item }) => {
    const avatarUri = getAvatarUri(item.profileImageUrl);
    return (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => navigation.navigate("Chat", { 
        recipientId: item.id, 
        recipientName: item.name,
        recipientImage: item.profileImageUrl
      })}
    >
      <View style={styles.avatarContainer}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} resizeMode="cover" />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {item.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.role}>{item.role} • {item.subject || " "}</Text>
      </View>
    </TouchableOpacity>
  )};

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          value={search}
          onChangeText={setSearch}
        />
      </View>
      
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchContacts(true)} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No contacts found.</Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    padding: 16,
    paddingTop: 20,
    backgroundColor: "transparent",
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8, // Exact web match
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  contactItem: {
    flexDirection: "row",
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12, // More structured look
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 14,
    flexShrink: 0,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 8, // Square-rounded match
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: "rgba(30, 58, 138, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  avatarText: {
    color: "#1e3a8a",
    fontSize: 20,
    fontWeight: "800",
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  role: {
    fontSize: 12,
    color: "#4b5563",
    marginTop: 2,
    fontWeight: "500",
  },
  emptyContainer: {
    marginTop: 80,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#4b5563",
    fontWeight: "500",
  },
});
