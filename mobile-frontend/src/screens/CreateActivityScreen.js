import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
  Modal,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createActivity, getAvailableTeachers } from "../services/api";
import ScreenContainer from "../components/ScreenContainer";
import { COLORS } from "../utils/constants";

export default function CreateActivityScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("VISITE_PEDAGOGIQUE");
  const [isOnline, setIsOnline] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [endTime, setEndTime] = useState("10:00");

  const [showPicker, setShowPicker] = useState(false); // For time
  const [showCalendar, setShowCalendar] = useState(false); // For date
  const [pickerMode, setPickerMode] = useState("time");
  const [activePickerField, setActivePickerField] = useState(""); // "startDate", "startTime", "endDate", "endTime"

  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingTeachers, setFetchingTeachers] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const data = await getAvailableTeachers();
        setAvailableTeachers(data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setFetchingTeachers(false);
      }
    }
    fetchTeachers();
  }, []);

  const handleCreate = async () => {
    if (!title || !startDate || !startTime || !endDate || !endTime) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const startDateTime = `${startDate}T${startTime}:00`;
      const endDateTime = `${endDate}T${endTime}:00`;

      if (new Date(startDateTime) >= new Date(endDateTime)) {
        Alert.alert("Invalid Schedule", "The end time must be after the start time.");
        setLoading(false);
        return;
      }

      const payload = {
        title,
        description,
        location: isOnline ? "Online" : location,
        type,
        isOnline,
        startDateTime,
        endDateTime,
        guestTeacherIds: selectedTeachers,
      };

      await createActivity(payload);
      Alert.alert("Success", "Activity created successfully!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTeacher = (id) => {
    if (selectedTeachers.includes(id)) {
      setSelectedTeachers(selectedTeachers.filter(tid => tid !== id));
    } else {
      setSelectedTeachers([...selectedTeachers, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTeachers.length === availableTeachers.length) {
      setSelectedTeachers([]); // Clear all
    } else {
      setSelectedTeachers(availableTeachers.map(t => t.id)); // Select all
    }
  };

  const showDateTimePicker = (field, mode) => {
    setActivePickerField(field);
    if (mode === "date") {
      setShowCalendar(true);
    } else {
      setPickerMode(mode);
      setShowPicker(true);
    }
  };

  const handleCalendarDayPress = (day) => {
    setShowCalendar(false);
    const selected = day.dateString;
    
    if (activePickerField === "startDate") {
      setStartDate(selected);
      if (new Date(selected) > new Date(endDate)) {
        setEndDate(selected);
      }
    }
    if (activePickerField === "endDate") {
      setEndDate(selected);
      if (new Date(selected) < new Date(startDate)) {
        setStartDate(selected);
      }
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (!selectedDate) return;

    if (activePickerField === "startDate" || activePickerField === "endDate") {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      if (activePickerField === "startDate") setStartDate(formattedDate);
      if (activePickerField === "endDate") setEndDate(formattedDate);
    } else {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;
      if (activePickerField === "startTime") setStartTime(formattedTime);
      if (activePickerField === "endTime") setEndTime(formattedTime);
    }
  };

  const ACTIVITY_TYPES = [
    { label: "Visite", value: "VISITE_PEDAGOGIQUE" },
    { label: "Formation", value: "FORMATION" },
    { label: "Inspection", value: "INSPECTION" },
    { label: "Réunion", value: "INVITATION_REUNION" },
    { label: "Séminaire", value: "SEMINAIRE" },
    { label: "Travail", value: "REUNION_TRAVAIL" },
  ];

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Secure New Schedule</Text>
          <Text style={styles.subtitle}>Establish a new professional session</Text>
        </View>

        <View style={styles.formGroup}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupIcon}>📝</Text>
            <Text style={styles.groupTitle}>Basic Information</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Visite de classe - 3ème Math"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
            <View style={styles.typeContainer}>
              {ACTIVITY_TYPES.map((t) => (
                <TouchableOpacity
                  key={t.value}
                  style={[styles.typeButton, type === t.value && styles.typeButtonActive]}
                  onPress={() => setType(t.value)}
                >
                  <Text style={[styles.typeButtonText, type === t.value && styles.typeButtonTextActive]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.formGroup}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupIcon}>🕒</Text>
            <Text style={styles.groupTitle}>Schedule Details</Text>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity style={styles.inputContainer} onPress={() => showDateTimePicker("startDate", "date")}>
                <Text style={styles.datePickerText}>{startDate}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.label}>Time</Text>
              <TouchableOpacity style={styles.inputContainer} onPress={() => showDateTimePicker("startTime", "time")}>
                <Text style={styles.datePickerText}>{startTime}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>End Date</Text>
              <TouchableOpacity style={styles.inputContainer} onPress={() => showDateTimePicker("endDate", "date")}>
                <Text style={styles.datePickerText}>{endDate}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.label}>Time</Text>
              <TouchableOpacity style={styles.inputContainer} onPress={() => showDateTimePicker("endTime", "time")}>
                <Text style={styles.datePickerText}>{endTime}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {showPicker && (
          <DateTimePicker
            value={new Date()}
            mode={pickerMode}
            display="default"
            onChange={handleDateChange}
          />
        )}

        <Modal visible={showCalendar} transparent={true} animationType="fade" onRequestClose={() => setShowCalendar(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.calendarContainer}>
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarTitle}>Select Date</Text>
                <TouchableOpacity onPress={() => setShowCalendar(false)}>
                  <Text style={styles.calendarClose}>✕</Text>
                </TouchableOpacity>
              </View>
              <Calendar
                onDayPress={handleCalendarDayPress}
                theme={{
                  selectedDayBackgroundColor: COLORS.primary,
                  todayTextColor: COLORS.primary,
                  arrowColor: COLORS.primary,
                }}
              />
            </View>
          </View>
        </Modal>

        <View style={styles.formGroup}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupIcon}>🎥</Text>
            <Text style={styles.groupTitle}>Meeting Type</Text>
          </View>

          <View style={styles.meetingTypeRow}>
            <TouchableOpacity
              style={[styles.meetingTypeCard, !isOnline && styles.meetingTypeCardActive]}
              onPress={() => setIsOnline(false)}
            >
              <Text style={styles.meetingTypeIcon}>📍</Text>
              <Text style={[styles.meetingTypeTitle, !isOnline && styles.meetingTypeTitleActive]}>In-Person</Text>
              <Text style={styles.meetingTypeDesc}>At location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.meetingTypeCard, isOnline && styles.meetingTypeCardActive]}
              onPress={() => { setIsOnline(true); setLocation("Online"); }}
            >
              <Text style={styles.meetingTypeIcon}>💻</Text>
              <Text style={[styles.meetingTypeTitle, isOnline && styles.meetingTypeTitleActive]}>Online</Text>
              <Text style={styles.meetingTypeDesc}>Jitsi Video</Text>
            </TouchableOpacity>
          </View>

          {!isOnline && (
            <View style={[styles.inputContainer, { marginTop: 16 }]}>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Specify location..."
              />
            </View>
          )}
        </View>

        <View style={styles.formGroup}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupIcon}>📄</Text>
            <Text style={styles.groupTitle}>Description</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Set the objectives for this session..."
              multiline
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <View style={[styles.groupHeader, { justifyContent: "space-between" }]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.groupIcon}>👥</Text>
              <Text style={styles.groupTitle}>Assign Teachers</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Text style={styles.statsText}>
                {selectedTeachers.length} / {availableTeachers.length}
              </Text>
              {availableTeachers.length > 0 && (
                <TouchableOpacity onPress={handleSelectAll}>
                  <Text style={styles.selectAllText}>
                    {selectedTeachers.length === availableTeachers.length ? "CLEAR ALL" : "SELECT ALL"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {fetchingTeachers ? (
            <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 20 }} />
          ) : availableTeachers.length === 0 ? (
            <Text style={styles.emptyTeachers}>No teachers found in your delegation.</Text>
          ) : (
            <View style={styles.teachersGrid}>
              {availableTeachers.map((teacher) => {
                const isSelected = selectedTeachers.includes(teacher.id);

                const getAvatarUri = (url) => {
                  if (!url || url === "null") return null;
                  if (url.startsWith("http") || url.startsWith("data:image")) return url;
                  const { API_BASE_URL } = require("../services/api");
                  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
                };
                const avatarUri = getAvatarUri(teacher.profileImageUrl);

                return (
                  <TouchableOpacity
                    key={teacher.id}
                    style={[styles.teacherCardPremium, isSelected && styles.teacherCardSelected]}
                    onPress={() => toggleTeacher(teacher.id)}
                  >
                    <View style={[styles.teacherAvatar, isSelected && { backgroundColor: "#2563eb" }]}>
                      {isSelected ? (
                        <Text style={styles.teacherAvatarText}>✓</Text>
                      ) : avatarUri ? (
                        <Image source={{ uri: avatarUri }} style={{ width: "100%", height: "100%", borderRadius: 20 }} resizeMode="cover" />
                      ) : (
                        <Text style={styles.teacherAvatarText}>{teacher.firstName?.charAt(0)}</Text>
                      )}
                    </View>
                    <View style={styles.teacherInfo}>
                      <Text style={styles.teacherName}>{teacher.firstName} {teacher.lastName}</Text>
                      <Text style={styles.teacherSchool}>{teacher.etablissement?.name || "Independent"}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.submitButtonWrapper}
          onPress={handleCreate}
          disabled={loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#2b4b9b", "#1e3a8a"]}
            style={styles.submitButton}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Finalize Planning</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingTop: 60, // Clear the transparent native header
    paddingBottom: 60,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#1e3a8a",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  formGroup: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#94a3b8",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  groupIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1e3a8a",
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4b5563",
    marginBottom: 6,
    marginTop: 12,
  },
  inputContainer: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    overflow: "hidden",
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0f172a",
  },
  datePickerText: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0f172a",
    fontWeight: "600",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    paddingBottom: 10,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e3a8a",
  },
  calendarClose: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#64748b",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
  },
  typeScroll: {
    marginHorizontal: -8,
  },
  typeContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: "rgba(30, 58, 138, 0.1)",
    borderColor: "#1e3a8a",
  },
  typeButtonText: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 14,
  },
  typeButtonTextActive: {
    color: "#1e3a8a",
    fontWeight: "700",
  },
  meetingTypeRow: {
    flexDirection: "row",
    gap: 12,
  },
  meetingTypeCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  meetingTypeCardActive: {
    borderColor: "#2563eb",
    backgroundColor: "#f0f9ff",
  },
  meetingTypeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  meetingTypeTitle: {
    fontWeight: "700",
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  meetingTypeTitleActive: {
    color: "#0369a1",
  },
  meetingTypeDesc: {
    fontSize: 12,
    color: "#94a3b8",
  },
  statsText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563eb",
    backgroundColor: "rgba(37, 99, 235, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectAllText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1e3a8a",
    textDecorationLine: "underline",
  },
  emptyTeachers: {
    textAlign: "center",
    color: "#94a3b8",
    padding: 16,
    fontStyle: "italic",
  },
  teachersGrid: {
    gap: 12,
  },
  teacherCardPremium: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
  },
  teacherCardSelected: {
    backgroundColor: "rgba(30, 58, 138, 0.05)",
    borderColor: "#1e3a8a",
  },
  teacherAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#1e3a8a",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  teacherAvatarText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 16,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontWeight: "700",
    fontSize: 15,
    color: "#0f172a",
  },
  teacherSchool: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  submitButtonWrapper: {
    marginTop: 16,
  },
  submitButton: {
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
});
