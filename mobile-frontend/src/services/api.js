import axios from "axios";
import Constants from "expo-constants";
import { getSession } from "./storage";

function resolveBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }

  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest2?.extra?.expoClient?.hostUri;

  if (hostUri) {
    const host = hostUri.split(":")[0];
    return `http://${host}:8081`;
  }

  return "http://10.0.2.2:8081";
}

export const API_BASE_URL = resolveBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Something went wrong. Please try again.";

    if (message.includes("timeout")) {
      message = "Cannot reach the backend. Make sure your phone and computer are on the same Wi-Fi and the Spring backend is running on port 8081.";
    }

    return Promise.reject(new Error(message));
  }
);

function unwrap(response) {
  return response?.data?.data ?? response?.data;
}

export async function login(payload) {
  const response = await api.post("/api/auth/login", payload);
  return unwrap(response);
}

export async function getInspectorCalendar() {
  const response = await api.get("/api/inspector/activities");
  return unwrap(response);
}

export async function getTeacherCalendar() {
  const response = await api.get("/api/teacher/activities");
  return unwrap(response);
}

export async function getInspectorActivityDetails(activityId) {
  const response = await api.get(`/api/inspector/activities/${activityId}`);
  return unwrap(response);
}

export async function getTeacherActivityDetails(activityId) {
  const response = await api.get(`/api/teacher/activities/${activityId}`);
  return unwrap(response);
}

export async function getCalendarForRole(role) {
  if (role === "INSPECTOR") {
    return getInspectorCalendar();
  }

  if (role === "TEACHER") {
    return getTeacherCalendar();
  }

  throw new Error("Unsupported role for calendar view.");
}

export async function createActivity(payload) {
  const response = await api.post("/api/inspector/activities", payload);
  return unwrap(response);
}

export async function getAvailableTeachers() {
  const response = await api.get("/api/inspector/activities/teachers");
  return response.data.data;
}

// Notifications
export async function getNotifications() {
  const response = await api.get("/api/notifications");
  return response.data.data;
}

export async function getUnreadNotificationsCount() {
  const response = await api.get("/api/notifications/unread-count");
  return response.data.data.count;
}

export async function markNotificationAsRead(id) {
  const response = await api.put(`/api/notifications/${id}/read`);
  return response.data;
}

export async function markAllNotificationsAsRead() {
  const response = await api.put("/api/notifications/read-all");
  return response.data;
}

export async function updatePushToken(token) {
  const response = await api.put("/api/notifications/push-token", { token });
  return response.data;
}

export async function getActivityDetailsForRole(role, activityId) {
  if (role === "INSPECTOR") {
    return getInspectorActivityDetails(activityId);
  }

  if (role === "TEACHER") {
    return getTeacherActivityDetails(activityId);
  }

  throw new Error("Unsupported role for activity details.");
}

export async function getConversations() {
  const response = await api.get("/api/messages/conversations");
  return unwrap(response);
}

export async function getContacts() {
  const response = await api.get("/api/messages/contacts");
  return unwrap(response);
}

export async function getMessages(conversationId) {
  const response = await api.get(`/api/messages/conversations/${conversationId}`);
  return unwrap(response);
}

export async function sendMessage(recipientId, content, fileUrl = null, fileName = null, fileType = null) {
  const response = await api.post("/api/messages", {
    recipientId,
    content,
    fileUrl,
    fileName,
    fileType,
  });
  return unwrap(response);
}

export async function uploadMessageFile(file) {
  const formData = new FormData();
  formData.append("file", {
    uri: file.uri,
    name: file.name || "upload.jpg",
    type: file.type || "image/jpeg",
  });
  const response = await api.post("/api/messages/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return unwrap(response);
}

export default api;
