import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LoadingScreen from "../components/LoadingScreen";
import { useAuth } from "../context/AuthContext";
import ActivityDetailsScreen from "../screens/ActivityDetailsScreen";
import LoginScreen from "../screens/LoginScreen";
import RoleCalendarScreen from "../screens/RoleCalendarScreen";
import ConversationsScreen from "../screens/ConversationsScreen";
import ChatScreen from "../screens/ChatScreen";
import ContactsScreen from "../screens/ContactsScreen";
import CreateActivityScreen from "../screens/CreateActivityScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import { COLORS, ROLES } from "../utils/constants";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { role } = useAuth();
  const isInspector = role === ROLES.inspector;
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShadowVisible: false,
        headerTransparent: true,
        headerStyle: {
          backgroundColor: "rgba(255, 255, 255, 0.7)",
        },
        headerTitleStyle: {
          color: COLORS.text,
          fontWeight: "900",
          fontSize: 18,
          letterSpacing: -0.5,
        },
        tabBarStyle: {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 70,
          paddingBottom: 12,
          paddingTop: 8,
          position: "absolute",
          elevation: 0,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontWeight: "700",
          fontSize: 10,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "HomeTab") iconName = focused ? "calendar" : "calendar-outline";
          else if (route.name === "MessagesTab") iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          else if (route.name === "AddTab") return (
            <View style={{
              width: 54,
              height: 54,
              borderRadius: 27,
              backgroundColor: COLORS.primary,
              justifyContent: "center",
              alignItems: "center",
              marginTop: -30,
              borderWidth: 4,
              borderColor: "#fff",
              shadowColor: COLORS.primary,
              shadowOpacity: 0.3,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 }
            }}>
              <Ionicons name="add" size={32} color="#fff" />
            </View>
          );
          else if (route.name === "ContactsTab") iconName = focused ? "people" : "people-outline";
          else if (route.name === "NotificationsTab") iconName = focused ? "notifications" : "notifications-outline";
          
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={RoleCalendarScreen} 
        options={{ title: "Calendar", tabBarLabel: "Home" }} 
      />
      <Tab.Screen 
        name="MessagesTab" 
        component={ConversationsScreen} 
        options={{ title: "Chat", tabBarLabel: "Chat" }} 
      />
      {isInspector && (
        <Tab.Screen 
          name="AddTab" 
          component={CreateActivityScreen} 
          options={{ title: "New Activity", tabBarLabel: "" }} 
        />
      )}
      <Tab.Screen 
        name="ContactsTab" 
        component={ContactsScreen} 
        options={{ title: "Contacts", tabBarLabel: "Contacts" }} 
      />
      <Tab.Screen 
        name="NotificationsTab" 
        component={NotificationsScreen} 
        options={{ title: "Notifications", tabBarLabel: "Alerts" }} 
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isLoading, role, signOut } = useAuth();

  if (isLoading) {
    return <LoadingScreen label="Restoring your session..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          },
          headerTitleStyle: {
            color: COLORS.text,
            fontWeight: "900",
            fontSize: 17,
            letterSpacing: -0.5,
          },
          contentStyle: {
            backgroundColor: "transparent",
          },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ActivityDetails"
              component={ActivityDetailsScreen}
              options={{ title: "Activity Details" }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={({ route }) => ({ 
                title: route.params.recipientName || "Chat",
                headerTitleStyle: { fontSize: 16, fontWeight: "800" }
              })}
            />
            <Stack.Screen
              name="CreateActivity"
              component={CreateActivityScreen}
              options={{ title: "New Activity" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
