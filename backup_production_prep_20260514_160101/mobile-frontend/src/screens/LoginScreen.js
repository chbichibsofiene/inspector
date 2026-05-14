import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ScreenContainer from "../components/ScreenContainer";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../utils/constants";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);
      await signIn({
        email: email.trim(),
        password,
      });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScreenContainer style={{ paddingHorizontal: 0 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboard}
      >
        {/* Decorative Dots from Web CSS */}
        <View style={[styles.dot, styles.dotBlue]} />
        <View style={[styles.dot, styles.dotGreen]} />
        <View style={[styles.dot, styles.dotYellow]} />

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <Image 
                source={require('../../assets/logo.png')} 
                style={styles.logoImage}
                defaultSource={require('../../assets/logo.png')}
              />
              <Text style={styles.brandTitle}>Pedagogy Center</Text>
            </View>
            <Text style={styles.heroTitle}>
              Supervise, train, and evaluate your <Text style={styles.brandText}>teachers</Text>
            </Text>
            <Text style={styles.heroDescription}>
              Transform pedagogical management into an efficient process with our professional portal.
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.field}>
              <Text style={styles.label}>Professional Email</Text>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="name@inspector.com"
                placeholderTextColor={COLORS.textLight}
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Security Password</Text>
              <TextInput
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor={COLORS.textLight}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity 
              disabled={isSubmitting} 
              onPress={handleSubmit} 
              activeOpacity={0.8}
              style={styles.submitBtnWrapper}
            >
              <View style={styles.submitBtn}>
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitBtnText}>Discover the platform →</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  dot: {
    position: "absolute",
    borderRadius: 999,
  },
  dotBlue: {
    width: 24,
    height: 24,
    backgroundColor: "#3b82f6",
    top: "10%",
    left: "5%",
  },
  dotGreen: {
    width: 30,
    height: 30,
    backgroundColor: "#10b981",
    bottom: "20%",
    left: "40%",
  },
  dotYellow: {
    width: 28,
    height: 28,
    backgroundColor: "#eab308",
    bottom: "15%",
    right: "10%",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    zIndex: 10,
  },
  header: {
    marginBottom: 40,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  logoImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2937",
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.5,
  },
  brandText: {
    color: "#1e3a8a",
  },
  heroDescription: {
    fontSize: 15,
    color: "#4b5563",
    marginTop: 16,
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 16,
    height: 52,
    fontSize: 16,
    color: "#111827",
  },
  submitBtnWrapper: {
    marginTop: 8,
  },
  submitBtn: {
    backgroundColor: "#2b4b9b",
    height: 56,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
});
