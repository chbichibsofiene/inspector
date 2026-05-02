import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, Linking, TouchableOpacity } from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import { getActivityDetailsForRole } from "../services/api";
import { COLORS } from "../utils/constants";
import { formatDayLabel, formatTimeRange } from "../utils/date";

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || "Not available"}</Text>
    </View>
  );
}

function getTypeName(type) {
  const types = {
    VISITE_PEDAGOGIQUE: "Visite Pédagogique",
    FORMATION: "Formation",
    INSPECTION: "Inspection",
    INVITATION_REUNION: "Invitation Réunion",
    SEMINAIRE: "Séminaire",
    REUNION_TRAVAIL: "Réunion de Travail",
    TRAINING: "Formation",
  };
  return types[type] || type;
}

export default function ActivityDetailsScreen({ route }) {
  const role = route.params?.role;
  const activityId = route.params?.activityId;
  const fallbackActivity = route.params?.activity;
  const [activity, setActivity] = useState(fallbackActivity || null);
  const [isLoading, setIsLoading] = useState(Boolean(activityId));
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDetails() {
      if (!activityId) {
        setIsLoading(false);
        return;
      }

      try {
        setError("");
        const result = await getActivityDetailsForRole(role, activityId);
        if (result) {
          setActivity(result);
        }
      } catch (loadError) {
        setError(
          `${loadError.message} Showing basic activity data instead.`
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDetails();
  }, [activityId, role]);

  const handleJoinMeeting = async () => {
    if (!activity?.meetingUrl) return;
    try {
      const canOpen = await Linking.canOpenURL(activity.meetingUrl);
      if (canOpen) {
        await Linking.openURL(activity.meetingUrl);
      } else {
        alert("Cannot open this URL");
      }
    } catch (e) {
      alert("Error opening link");
    }
  };

  const guestsLabel = useMemo(() => {
    if (!activity?.guests?.length) {
      return "No guests listed";
    }

    return activity.guests
      .map((guest) => guest.fullName || guest.name || guest.email)
      .filter(Boolean)
      .join(", ");
  }, [activity]);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loaderText}>Loading details...</Text>
          </View>
        ) : null}

        {!isLoading && activity ? (
          <View style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getTypeName(activity.type)}</Text>
            </View>
            <Text style={styles.title}>{activity.title || "Untitled"}</Text>
            <Text style={styles.subtitle}>
              {formatDayLabel(activity.startDateTime)}
            </Text>

            {error ? <Text style={styles.warning}>{error}</Text> : null}

            {activity.isOnline && activity.meetingUrl ? (
              <TouchableOpacity style={styles.joinBtn} onPress={handleJoinMeeting} activeOpacity={0.8}>
                <Text style={styles.joinBtnText}>Join Meeting Now →</Text>
              </TouchableOpacity>
            ) : null}

            <DetailRow
              label="Time"
              value={formatTimeRange(activity.startDateTime, activity.endDateTime)}
            />
            <DetailRow label="Location" value={activity.location} />
            <DetailRow label="Inspector" value={activity.inspectorName} />
            <DetailRow label="Guests" value={guestsLabel} />
            <DetailRow label="Mode" value={activity.isOnline ? "Online" : "In person"} />

            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {activity.description || "No description provided."}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loader: {
    marginTop: 40,
    alignItems: "center",
    gap: 14,
  },
  loaderText: {
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeText: {
    color: COLORS.primary,
    fontWeight: "900",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    marginTop: 16,
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -1,
    lineHeight: 34,
  },
  subtitle: {
    marginTop: 8,
    color: "#1e3a8a",
    fontWeight: "700",
    fontSize: 15,
  },
  joinBtn: {
    marginTop: 24,
    backgroundColor: "#2b4b9b",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2b4b9b",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  joinBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  warning: {
    marginTop: 16,
    color: COLORS.danger,
    lineHeight: 20,
    backgroundColor: "rgba(225, 29, 72, 0.05)",
    padding: 12,
    borderRadius: 12,
    fontSize: 13,
  },
  detailRow: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  detailLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    textTransform: "uppercase",
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  detailValue: {
    marginTop: 6,
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 24,
  },
  sectionTitle: {
    marginTop: 28,
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 18,
    letterSpacing: -0.5,
  },
  description: {
    marginTop: 12,
    color: COLORS.textMuted,
    lineHeight: 24,
    fontSize: 15,
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "900",
  },
  emptyText: {
    marginTop: 10,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 22,
    fontSize: 15,
  },
});
