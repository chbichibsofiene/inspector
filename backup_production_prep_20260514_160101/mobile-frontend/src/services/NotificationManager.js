import * as Notifications from "expo-notifications";
import { getNotifications } from "./api";

let lastNotificationId = null;
let pollInterval = null;

export async function startNotificationPolling() {
  if (pollInterval) return;
  console.log("🔔 [NotificationManager] Starting polling service...");

  // Set initial state
  try {
    const initial = await getNotifications();
    if (initial && initial.length > 0) {
      // Find the highest ID even if read, to avoid spamming old notifications
      const maxId = Math.max(...initial.map(n => n.id));
      lastNotificationId = maxId;
      console.log(`🔔 [NotificationManager] Initialized. Last seen ID: ${lastNotificationId}`);
    }
  } catch (e) {
    console.warn("🔔 [NotificationManager] Initial fetch failed, will retry during polling.");
  }

  pollInterval = setInterval(async () => {
    try {
      const notifications = await getNotifications();
      if (!notifications || notifications.length === 0) return;

      // We look for any notification with ID > lastNotificationId
      const newNotifications = notifications.filter(n => lastNotificationId === null || n.id > lastNotificationId);
      
      if (newNotifications.length > 0) {
        // Sort by ID to process newest last
        newNotifications.sort((a, b) => a.id - b.id);
        
        for (const newest of newNotifications) {
          console.log(`🔔 [NotificationManager] NEW Notification! ID: ${newest.id} - ${newest.title}`);
          
          await Notifications.scheduleNotificationAsync({
            content: {
              title: newest.title,
              body: newest.message,
              data: { targetUrl: newest.targetUrl },
              sound: true,
              priority: Notifications.AndroidNotificationPriority.MAX,
              color: "#1e3a8a",
              vibrate: [0, 250, 250, 250],
            },
            trigger: null,
          });
          
          lastNotificationId = Math.max(lastNotificationId || 0, newest.id);
        }
      }
    } catch (error) {
      // Polling errors are expected if network drops
    }
  }, 5000); // Check every 5 seconds for responsive testing
}

export function stopNotificationPolling() {
  if (pollInterval) {
    console.log("🔔 [NotificationManager] Stopping polling service...");
    clearInterval(pollInterval);
    pollInterval = null;
  }
}
