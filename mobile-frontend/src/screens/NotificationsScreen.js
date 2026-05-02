import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../services/api";
import ScreenContainer from "../components/ScreenContainer";
import { COLORS } from "../utils/constants";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchNotifications = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleNotificationPress = async (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    const { targetUrl, type } = notification;
    if (!targetUrl) return;

    try {
      // Example targetUrl patterns:
      // /inspector/activities/15
      // /teacher/activities/22
      // /messages/conversation/5
      
      if (targetUrl.includes("/activities/")) {
        const parts = targetUrl.split("/");
        const activityId = parts[parts.length - 1];
        const role = targetUrl.includes("/inspector/") ? "INSPECTOR" : "TEACHER";
        
        navigation.navigate("ActivityDetails", { activityId, role });
      } 
      else if (targetUrl.includes("/messages")) {
        // If it's a specific conversation
        if (targetUrl.includes("/conversation/")) {
          const parts = targetUrl.split("/");
          const recipientId = parts[parts.length - 1];
          // We might not have the name, so we'll just navigate with the ID
          navigation.navigate("Chat", { recipientId, recipientName: "Chat" });
        } else {
          // General messages
          navigation.navigate("MessagesTab");
        }
      }
    } catch (error) {
      console.error("Navigation error from notification:", error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.isRead && styles.unreadItem]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.dotContainer}>
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, !item.isRead && styles.unreadTitle]}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Alerts</Text>
        {notifications.some(n => !n.isRead) && (
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={styles.markAll}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications.filter(n => !n.isRead)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchNotifications(true)} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>All caught up! No new alerts.</Text>
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
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
  markAll: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationItem: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  unreadItem: {
    backgroundColor: "#ffffff",
    borderColor: COLORS.primarySoft,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  dotContainer: {
    width: 12,
    alignItems: "center",
    paddingTop: 6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: "800",
  },
  message: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 16,
  },
});
