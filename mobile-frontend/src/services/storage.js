import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../utils/constants";

export async function saveSession(session) {
  await AsyncStorage.setItem(STORAGE_KEYS.authSession, JSON.stringify(session));
}

export async function getSession() {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.authSession);
  return raw ? JSON.parse(raw) : null;
}

export async function clearSession() {
  await AsyncStorage.removeItem(STORAGE_KEYS.authSession);
}
