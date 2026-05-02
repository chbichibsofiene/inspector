import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import ScreenContainer from "./ScreenContainer";
import { COLORS } from "../utils/constants";

export default function LoadingScreen({ label = "Loading..." }) {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.label}>{label}</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  label: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
});
