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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getConversations } from "../services/api";
import ScreenContainer from "../components/ScreenContainer";
import { COLORS } from "../utils/constants";
import { useAuth } from "../context/AuthContext";

export default function ConversationsScreen() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { session } = useAuth();

  const fetchConversations = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await getConversations();
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    
    // Refresh when screen is focused
    const unsubscribe = navigation.addListener("focus", () => {
      fetchConversations();
    });
    return unsubscribe;
  }, [fetchConversations, navigation]);

  const renderItem = ({ item }) => {
    const isMe = item.lastMessageSenderId === session?.userId;
    const date = item.lastMessageTime 
      ? new Date(item.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : "";

    const getAvatarUri = (url) => {
      if (!url || url === "null") return null;
      if (url.startsWith("http") || url.startsWith("data:image")) return url;
      const { API_BASE_URL } = require("../services/api");
      return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };
    
    const avatarUri = getAvatarUri(item.otherUserProfileImageUrl);

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => navigation.navigate("Chat", { 
          recipientId: item.otherUserId, 
          recipientName: item.otherUserName,
          recipientImage: item.otherUserProfileImageUrl
        })}
      >
        <View style={styles.avatarContainer}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} resizeMode="cover" />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {item.otherUserName?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name} numberOfLines={1}>
              {item.otherUserName}
            </Text>
            <Text style={styles.date}>{date}</Text>
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {isMe ? "You: " : ""}{item.lastMessage || "No messages yet"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Messages</Text>
        <TouchableOpacity 
          style={styles.newChatIconButton}
          onPress={() => navigation.navigate("ContactsTab")}
        >
          <Text style={{ fontSize: 18 }}>➕</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.otherUserId.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchConversations(true)} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No conversations yet.</Text>
            <TouchableOpacity 
              style={styles.newChatButton}
              onPress={() => navigation.navigate("ContactsTab")}
            >
              <Text style={styles.newChatButtonText}>Start a Chat</Text>
            </TouchableOpacity>
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
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    paddingBottom: 12,
    marginTop: 10,
  },
  listTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -1,
  },
  newChatIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primarySoft,
    justifyContent: "center",
    alignItems: "center",
  },
  conversationItem: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarContainer: {
    marginRight: 14,
    position: "relative",
    flexShrink: 0,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primarySoft,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarText: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: "800",
  },
  unreadBadge: {
    position: "absolute",
    right: -2,
    top: -2,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    paddingHorizontal: 4,
  },
  unreadText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
  },
  content: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: 24,
    fontWeight: "600",
  },
  newChatButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 999,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  newChatButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});
