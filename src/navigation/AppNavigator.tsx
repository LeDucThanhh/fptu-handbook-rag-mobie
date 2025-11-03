import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../contexts/AuthContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AIQAScreen from '../screens/AIQAScreen';
import ClubDirectoryScreen from '../screens/ClubDirectoryScreen';
import ClubDetailScreen from '../screens/ClubDetailScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Types
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  ClubDetail: {clubId: string};
};

export type MainTabParamList = {
  Home: undefined;
  AIQA: undefined;
  Clubs: undefined;
  Notifications: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#666',
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarActiveTintColor: '#FF6B35',
          tabBarInactiveTintColor: '#666',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AIQA"
        component={AIQAScreen}
        options={{
          tabBarLabel: 'Hỏi AI',
          tabBarActiveTintColor: '#FF6B35',
          tabBarInactiveTintColor: '#666',
          tabBarIcon: ({color, size}) => (
            <Icon name="smart-toy" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Clubs"
        component={ClubDirectoryScreen}
        options={{
          tabBarLabel: 'Câu lạc bộ',
          tabBarActiveTintColor: '#FF6B35',
          tabBarInactiveTintColor: '#666',
          tabBarIcon: ({color, size}) => (
            <Icon name="groups" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Thông báo',
          tabBarActiveTintColor: '#FF6B35',
          tabBarInactiveTintColor: '#666',
          tabBarIcon: ({color, size}) => (
            <Icon name="notifications" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarActiveTintColor: '#FF6B35',
          tabBarInactiveTintColor: '#666',
          tabBarIcon: ({color, size}) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const {isAuthenticated, isLoading} = useAuth();

  if (isLoading) {
    // You can add a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="ClubDetail"
              component={ClubDetailScreen}
              options={{
                headerShown: true,
                title: 'Chi tiết Câu lạc bộ',
                headerBackTitleVisible: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
