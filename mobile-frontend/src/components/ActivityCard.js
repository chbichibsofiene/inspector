import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../utils/constants";
import { formatTimeRange } from "../utils/date";

function getTypeName(type) {
  const types = {
    VISITE_PEDAGOGIQUE: "Visite",
    FORMATION: "Formation",
    INSPECTION: "Inspection",
    INVITATION_REUNION: "Réunion",
    SEMINAIRE: "Séminaire",
    REUNION_TRAVAIL: "Travail",
    TRAINING: "Formation",
  };
  return types[type] || type;
}

function getTypeColor(type) {
  const colors = {
    VISITE_PEDAGOGIQUE: "#4f46e5",
    FORMATION: "#8b5cf6",
    INSPECTION: "#e11d48",
    INVITATION_REUNION: "#0ea5e9",
  };
  return colors[type] || COLORS.primary;
}

export default function ActivityCard({ activity, onPress }) {
  const typeColor = getTypeColor(activity.type);
  const typeName = getTypeName(activity.type);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.typeAccent, { backgroundColor: typeColor }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: `${typeColor}15` }]}>
            <Text style={[styles.badgeText, { color: typeColor }]}>{typeName}</Text>
          </View>
          <Text style={styles.time}>{formatTimeRange(activity.startDateTime, activity.endDateTime)}</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>{activity.title || "Untitled activity"}</Text>
        <View style={styles.footer}>
          <Text style={styles.location} numberOfLines={1}>📍 {activity.location || (activity.isOnline ? "Online" : "Not specified")}</Text>
          <Text style={styles.chevron}>→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 24,
    marginBottom: 14,
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  typeAccent: {
    width: 6,
  },
  content: {
    flex: 1,
    padding: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  time: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "700",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  location: {
    fontSize: 13,
  },
});
