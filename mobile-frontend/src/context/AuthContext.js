import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearSession, getSession, saveSession } from "../services/storage";
import { login as loginRequest } from "../services/api";
import { registerForPushNotificationsAsync } from "../services/PushNotificationService";
import { startNotificationPolling, stopNotificationPolling } from "../services/NotificationManager";
import { ROLES } from "../utils/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const savedSession = await getSession();
      setSession(savedSession);
      if (savedSession?.token) {
        registerForPushNotificationsAsync();
        startNotificationPolling();
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(credentials) {
    const response = await loginRequest(credentials);
    const role = response?.role;

    if (![ROLES.inspector, ROLES.teacher].includes(role)) {
      throw new Error("This mobile app supports only INSPECTOR and TEACHER roles.");
    }

    const nextSession = {
      token: response.token,
      tokenType: response.tokenType,
      email: response.email,
      role,
      userId: response.userId,
      profileCompleted: response.profileCompleted,
      profileImageUrl: response.profileImageUrl,
    };

    await saveSession(nextSession);
    setSession(nextSession);
    
    // Register for push notifications
    registerForPushNotificationsAsync();
    startNotificationPolling();
    
    return nextSession;
  }

  async function signOut() {
    stopNotificationPolling();
    await clearSession();
    setSession(null);
  }

  const value = useMemo(
    () => ({
      session,
      role: session?.role ?? null,
      isAuthenticated: Boolean(session?.token),
      isLoading,
      signIn,
      signOut,
    }),
    [isLoading, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
