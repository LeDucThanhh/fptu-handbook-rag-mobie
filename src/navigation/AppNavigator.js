import React, { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useTheme } from '../theme';
import useAuth from '../hooks/useAuth';
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/home/HomeScreen';
import ResourcesScreen from '../screens/home/ResourcesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
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

const MainTabs = () => {
  const { colors, typography } = useTheme();

  const iconForRoute = (routeName, focused) => {
    const icons = {
      Home: focused ? 'home' : 'home-outline',
      Resources: focused ? 'book' : 'book-outline',
      Profile: focused ? 'person' : 'person-outline'
    };

    return icons[routeName] ?? 'ellipse';
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border
        },
        tabBarLabelStyle: {
          fontFamily: typography.caption.fontFamily,
          fontSize: typography.caption.fontSize
        },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={iconForRoute(route.name, focused)} size={size} color={color} />
        )
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Resources" component={ResourcesScreen} options={{ title: 'Resources' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
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

