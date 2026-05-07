import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MonthlyCalendar from "../components/MonthlyCalendar";
import ScreenContainer from "../components/ScreenContainer";
import { useAuth } from "../context/AuthContext";
import { getCalendarForRole, getDashboardForRole, API_BASE_URL } from "../services/api";
import { COLORS, ROLES } from "../utils/constants";

export default function RoleCalendarScreen({ navigation, route }) {
  const { role, session, signOut } = useAuth();
  const screenRole = route.params?.role || role;
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [profileImg, setProfileImg] = useState(session?.profileImageUrl);
  const title = screenRole === ROLES.inspector 

  useLayoutEffect(() => {
    navigation.setOptions({
      title,
      headerRight: () => (
        <TouchableOpacity 
          onPress={signOut}
          style={{
            backgroundColor: "rgba(225, 29, 72, 0.1)",
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 20,
            marginRight: 16,
            borderWidth: 1,
            borderColor: "rgba(225, 29, 72, 0.2)",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{
            color: "#e11d48",
            fontWeight: "800",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}>Sign Out</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, signOut, title, screenRole]);

  const loadActivities = useCallback(async () => {
    try {
      setError("");
      const [activitiesData, dashboardData] = await Promise.all([
        getCalendarForRole(screenRole),
        getDashboardForRole(screenRole)
      ]);
      setActivities(Array.isArray(activitiesData) ? activitiesData : []);
      if (dashboardData?.profileImageUrl) {
        setProfileImg(dashboardData.profileImageUrl);
      }
    } catch (loadError) {
      setError(loadError.message);
    }
  }, [screenRole]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  async function handleRefresh() {
    setIsRefreshing(true);
    await loadActivities();
    setIsRefreshing(false);
  }

  function handleActivityPress(activity) {
    navigation.navigate("ActivityDetails", {
      activityId: activity.id,
      role: screenRole,
      activity,
    });
  }

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} />
        }
      >
        <View style={styles.hero}>
          <LinearGradient
            colors={["#1e293b", "#334155"]}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.heroContent}>
            <View style={styles.heroTextContainer}>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.email} numberOfLines={1}>
                {session?.email ? session.email.split('@')[0] : "Inspector"}
              </Text>
              <View style={styles.heroTags}>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>{screenRole}</Text>
                </View>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>📅 {activities.length} Activities</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.heroAvatar}>
              {profileImg && profileImg !== "null" && !imgError ? (
                <Image 
                  source={{ 
                    uri: profileImg.startsWith("http") || profileImg.startsWith("data:image")
                      ? profileImg 
                      : `${API_BASE_URL}${profileImg.startsWith('/') ? '' : '/'}${profileImg}`
                  }}
                  style={styles.heroAvatarImage}
                  onError={() => setImgError(true)}
                />
              ) : (
                <Text style={styles.heroAvatarText}>
                  {session?.email ? session.email.charAt(0).toUpperCase() : "I"}
                </Text>
              )}
            </View>
          </View>
        </View>

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Unable to load calendar</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.calendarContainer}>
          <MonthlyCalendar activities={activities} onActivityPress={handleActivityPress} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingTop: 72, // Increased to ensure the hero clears the transparent header on notched devices
    paddingBottom: 40,
  },
  hero: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#0f172a",
    shadowOpacity: 0.4,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroTextContainer: {
    flex: 1,
    paddingRight: 24,
  },
  greeting: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  email: {
    marginTop: 4,
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  heroTags: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  heroBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  heroBadgeText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    justifyContent: "center",
  },
  heroAvatarText: {
    color: "#94a3b8",
    fontSize: 28,
    fontWeight: "800",
  },
  heroAvatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 32,
  },
  calendarContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 24, // --radius-lg
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  errorCard: {
    backgroundColor: "#fff1f2",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#fee2e2",
  },
  errorTitle: {
    color: "#e11d48",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 4,
  },
  errorText: {
    color: "#4b5563",
    fontSize: 13,
  },
  headerButton: {
    color: "#2563eb", // .nav-link
    fontWeight: "600",
    fontSize: 14,
    textTransform: "uppercase",
  },
});
