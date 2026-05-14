import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { COLORS } from "../utils/constants";
import { formatDayLabel, groupActivitiesByDate, toDateKey } from "../utils/date";
import ActivityCard from "./ActivityCard";

export default function MonthlyCalendar({ activities, onActivityPress }) {
  const groupedActivities = useMemo(() => groupActivitiesByDate(activities), [activities]);
  const defaultDate = useMemo(() => {
    const firstActivity = activities[0];
    return toDateKey(firstActivity?.startDateTime) || toDateKey(new Date());
  }, [activities]);
  const [selectedDate, setSelectedDate] = useState(defaultDate);

  const markedDates = useMemo(() => {
    const result = {};

    Object.keys(groupedActivities).forEach((dateKey) => {
      result[dateKey] = {
        marked: true,
        dotColor: COLORS.accent,
      };
    });

    result[selectedDate] = {
      ...(result[selectedDate] || {}),
      selected: true,
      selectedColor: COLORS.primary,
    };

    return result;
  }, [groupedActivities, selectedDate]);

  const dayActivities = groupedActivities[selectedDate] || [];

  return (
    <View style={styles.wrapper}>
      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          backgroundColor: COLORS.surface,
          calendarBackground: COLORS.surface,
          textSectionTitleColor: COLORS.textMuted,
          selectedDayBackgroundColor: COLORS.primary,
          selectedDayTextColor: "#ffffff",
          todayTextColor: COLORS.accent,
          dayTextColor: COLORS.text,
          monthTextColor: COLORS.text,
          arrowColor: COLORS.primary,
        }}
        style={styles.calendar}
      />

      <View style={styles.dayHeader}>
        <Text style={styles.dayTitle}>{formatDayLabel(selectedDate)}</Text>
        <Text style={styles.dayCount}>
          {dayActivities.length} {dayActivities.length === 1 ? "activity" : "activities"}
        </Text>
      </View>

      {dayActivities.length ? (
        dayActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onPress={() => onActivityPress(activity)}
          />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No scheduled activities</Text>
          <Text style={styles.emptyText}>
            Select another day to view assigned activities.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  calendar: {
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 18,
  },
  dayHeader: {
    marginBottom: 14,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  dayCount: {
    marginTop: 4,
    color: COLORS.textMuted,
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  emptyText: {
    marginTop: 6,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
});
