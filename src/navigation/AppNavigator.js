import React, { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useTheme } from '../theme';
import useAuth from '../hooks/useAuth';
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AskAIScreen from '../screens/ai/AskAIScreen';
import ClubDirectoryScreen from '../screens/clubs/ClubDirectoryScreen';
import ClubDetailScreen from '../screens/clubs/ClubDetailScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import HandbookScreen from '../screens/handbook/HandbookScreen';
import CustomTabBar from '../components/navigation/CustomTabBar';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const LoadingState = () => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background
      }}
    >
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={{ transform: [{ scale: 1.4 }] }}
      />
    </View>
  );
};

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

// Stack Navigator for Home tab (includes nested screens)
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

// Stack Navigator for CLB tab
const ClubStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ClubDirectory" component={ClubDirectoryScreen} />
    <Stack.Screen name="ClubDetail" component={ClubDetailScreen} />
  </Stack.Navigator>
);

// Stack Navigator for Ask AI tab
const AskAIStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AskAIMain" component={AskAIScreen} />
  </Stack.Navigator>
);

const MainTabs = () => {
  const { colors, typography } = useTheme();

  const iconForRoute = (routeName, focused) => {
    const icons = {
      Home: focused ? 'home' : 'home-outline',
      Handbook: focused ? 'book' : 'book-outline',
      Clubs: focused ? 'people' : 'people-outline',
      AskAI: focused ? 'chatbubbles' : 'chatbubbles-outline',
      Notifications: focused ? 'notifications' : 'notifications-outline',
      Profile: focused ? 'person' : 'person-outline'
    };

    return icons[routeName] ?? 'ellipse';
  };

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ title: 'Trang chủ' }} />
      <Tab.Screen name="Handbook" component={HandbookScreen} options={{ title: 'Sổ tay' }} />
      <Tab.Screen name="Clubs" component={ClubStack} options={{ title: 'CLB' }} />
      <Tab.Screen name="AskAI" component={AskAIStack} options={{ title: 'Hỏi AI' }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Thông báo' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Cá nhân' }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { colors } = useTheme();
  const { isAuthenticated, isHydrating } = useAuth();

  const navigationTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: colors.background,
        card: colors.surface,
        text: colors.textPrimary,
        border: colors.border,
        primary: colors.primary
      }
    }),
    [colors]
  );

  if (isHydrating) {
    return <LoadingState />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;

