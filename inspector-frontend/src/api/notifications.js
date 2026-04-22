import http from "./http";

export const getNotifications = () => http.get("/notifications");
export const getUnreadCount = () => http.get("/notifications/unread-count");
export const markAsRead = (id) => http.put(`/notifications/${id}/read`);
export const markAllAsRead = () => http.put("/notifications/read-all");
