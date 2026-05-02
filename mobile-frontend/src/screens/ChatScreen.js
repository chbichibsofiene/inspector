import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getMessages, sendMessage } from "../services/api";
import ScreenContainer from "../components/ScreenContainer";
import { COLORS } from "../utils/constants";
import { useAuth } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function ChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { recipientId, recipientName, recipientImage, conversationId } = route.params;
  const { session } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const flatListRef = useRef();

  const fetchMessages = useCallback(async () => {
    try {
      let currentConvId = conversationId;
      
      // If we don't have a conversationId (e.g., coming from Contacts), try to find it
      if (!currentConvId) {
        const { getConversations } = require("../services/api");
        const convs = await getConversations();
        const existing = convs.find(c => c.otherUserId === recipientId);
        if (existing) {
          currentConvId = existing.id;
          // Update navigation params so it's saved
          navigation.setParams({ conversationId: currentConvId });
        }
      }

      if (currentConvId) {
        const data = await getMessages(currentConvId);
        setMessages(data);
      } else {
        setMessages([]); // New chat, no messages yet
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [recipientId, conversationId, navigation]);

  useEffect(() => {
    navigation.setOptions({ title: recipientName });
    fetchMessages();
    
    // Polling for new messages (simple implementation)
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages, navigation, recipientName]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText("");
    setSending(true);

    try {
      await sendMessage(recipientId, text);
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleUploadAndSend = async (fileUri, fileName, fileType) => {
    try {
      setSending(true);
      const { uploadMessageFile } = require("../services/api");
      const res = await uploadMessageFile({
        uri: fileUri,
        name: fileName,
        type: fileType,
      });
      
      const fUrl = res.data?.fileUrl || res.fileUrl;
      const fName = res.data?.fileName || res.fileName || fileName;
      const fType = res.data?.fileType || res.fileType || fileType;

      await sendMessage(recipientId, "", fUrl, fName, fType);
      fetchMessages();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to send attachment.");
    } finally {
      setSending(false);
    }
  };

  const openCamera = async () => {
    const ImagePicker = require("expo-image-picker");
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Camera permission is required!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Correct usage in Expo 54
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const fileName = asset.uri.split('/').pop() || "camera_image.jpg";
      handleUploadAndSend(asset.uri, fileName, "image/jpeg");
    }
  };

  const openGallery = async () => {
    const ImagePicker = require("expo-image-picker");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Correct usage in Expo 54
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const fileName = asset.uri.split('/').pop() || "gallery_image.jpg";
      handleUploadAndSend(asset.uri, fileName, "image/jpeg");
    }
  };

  const openDocumentPicker = async () => {
    const DocumentPicker = require("expo-document-picker");
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      handleUploadAndSend(asset.uri, asset.name, asset.mimeType || "application/octet-stream");
    }
  };

  const handleAttachPress = () => {
    const { Alert } = require("react-native");
    Alert.alert(
      "Attach File",
      "Choose where to attach the file from:",
      [
        { text: "Camera", onPress: openCamera },
        { text: "Photo Gallery", onPress: openGallery },
        { text: "Documents", onPress: openDocumentPicker },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleFilePress = async (item) => {
    try {
      const { API_BASE_URL } = require("../services/api");
      const fileUrl = `${API_BASE_URL}${item.fileUrl.startsWith('/') ? '' : '/'}${item.fileUrl}`;
      const FileSystem = require("expo-file-system/legacy");
      const Sharing = require("expo-sharing");

      let fileName = item.fileName || "document";
      if (!fileName.toLowerCase().endsWith('.pdf') && 
          (item.fileUrl.toLowerCase().endsWith('.pdf') || item.fileType === "application/pdf")) {
        fileName += ".pdf";
      }
      const localUri = `${FileSystem.documentDirectory}${fileName}`;

      const downloadRes = await FileSystem.downloadAsync(fileUrl, localUri);

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(downloadRes.uri, {
          mimeType: item.fileType || "application/pdf",
          dialogTitle: "Open Document",
          UTI: fileName.endsWith('.pdf') ? "com.adobe.pdf" : "public.data",
        });
      } else {
        const { Linking } = require("react-native");
        Linking.openURL(fileUrl);
      }
    } catch (e) {
      console.error("Error opening file:", e);
      const { Alert } = require("react-native");
      Alert.alert("Error", "Could not download or open the file.");
    }
  };

  const renderItem = ({ item }) => {
    const isMe = item.senderId === session?.userId;
    const time = item.timestamp 
      ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : "";

    const isImage = item.fileUrl && item.fileType && item.fileType.startsWith("image/");
    const isFile = item.fileUrl && !isImage;

    const getAvatarUri = (url) => {
      if (!url || url === "null") return null;
      if (url.startsWith("http") || url.startsWith("data:image")) return url;
      const { API_BASE_URL } = require("../services/api");
      return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };
    const avatarUri = getAvatarUri(route.params?.recipientImage);

    return (
      <View style={[styles.messageWrapper, isMe ? styles.myMessageWrapper : styles.otherMessageWrapper]}>
        {!isMe && (
          <View style={styles.chatAvatarContainer}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.chatAvatar} resizeMode="cover" />
            ) : (
              <View style={styles.chatAvatarPlaceholder}>
                <Text style={styles.chatAvatarText}>{route.params?.recipientName?.charAt(0).toUpperCase()}</Text>
              </View>
            )}
          </View>
        )}
        <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.otherBubble]}>
          
          {item.content ? (
            <Text style={[styles.messageText, isMe ? styles.myText : styles.otherText]}>
              {item.content}
            </Text>
          ) : null}

          {isImage && (
            <TouchableOpacity onPress={() => setSelectedImage(`${require("../services/api").API_BASE_URL}${item.fileUrl.startsWith('/') ? '' : '/'}${item.fileUrl}`)}>
              <Image 
                source={{ uri: `${require("../services/api").API_BASE_URL}${item.fileUrl.startsWith('/') ? '' : '/'}${item.fileUrl}` }} 
                style={styles.chatImage} 
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}

          {isFile && (
            <TouchableOpacity 
              style={styles.fileContainer}
              onPress={() => handleFilePress(item)}
            >
              <Text style={styles.fileIcon}>📄</Text>
              <Text style={[styles.fileName, isMe ? styles.myText : styles.otherText]} numberOfLines={1}>
                {item.fileName || "Download Attachment"}
              </Text>
            </TouchableOpacity>
          )}

          <Text style={[styles.timeText, isMe ? styles.myTime : styles.otherTime]}>
            {time}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScreenContainer style={{ paddingHorizontal: 0 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => (item.id || Math.random()).toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton} onPress={handleAttachPress}>
            <Text style={styles.attachIcon}>📎</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            placeholderTextColor={COLORS.textLight}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={18} color="#fff" style={{ marginLeft: 4 }} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={!!selectedImage} transparent={true} animationType="fade" onRequestClose={() => setSelectedImage(null)}>
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSelectedImage(null)}>
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>
          <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} resizeMode="contain" />
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100, // For headerTransparent
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 20,
    paddingBottom: 20,
  },
  messageWrapper: {
    marginBottom: 16,
    flexDirection: "row",
    width: "100%",
  },
  myMessageWrapper: {
    justifyContent: "flex-end",
  },
  otherMessageWrapper: {
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  chatAvatarContainer: {
    marginRight: 8,
    marginBottom: 4,
    flexShrink: 0,
  },
  chatAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  chatAvatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  chatAvatarText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  myBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  myText: {
    color: "#fff",
    fontWeight: "600",
  },
  otherText: {
    color: COLORS.text,
  },
  timeText: {
    fontSize: 10,
    marginTop: 6,
    alignSelf: "flex-end",
    fontWeight: "600",
  },
  myTime: {
    color: "rgba(255,255,255,0.7)",
  },
  otherTime: {
    color: COLORS.textMuted,
  },
  chatImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginTop: 4,
    marginBottom: 4,
  },
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  fileIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    alignItems: "flex-end",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 12,
    marginRight: 10,
    fontSize: 15,
    maxHeight: 120,
    color: COLORS.text,
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(37, 99, 235, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 2,
  },
  attachIcon: {
    fontSize: 22,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.border,
    shadowOpacity: 0,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 18,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseButton: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  fullScreenImage: {
    width: "100%",
    height: "80%",
  },
});
