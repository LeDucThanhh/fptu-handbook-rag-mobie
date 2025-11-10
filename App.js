import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
  Urbanist_800ExtraBold
} from '@expo-google-fonts/urbanist';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from './src/theme';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync().catch(() => {
  // ignore rejections, app will continue with default splash behaviour
});

const LoadingScreen = () => {
  const { colors, typography } = useTheme();
  return (
    <View style={[styles.centered, { backgroundColor: colors.background }]}>
      <ActivityIndicator size={40} color={colors.primary} />
      <Text style={[styles.loadingText, { color: colors.textSecondary, fontFamily: typography.body.medium.fontFamily }]}>
        Loading FPT Handbook...
      </Text>
    </View>
  );
};

export default function App() {
  const [fontsLoaded, fontLoadError] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
    Urbanist_800ExtraBold
  });

  useEffect(() => {
    if (fontsLoaded || fontLoadError) {
      SplashScreen.hideAsync().catch(() => {
        // ignore hide errors
      });
    }
  }, [fontsLoaded, fontLoadError]);

  if (!fontsLoaded && !fontLoadError) {
    return (
      <ThemeProvider>
        <SafeAreaProvider>
          <LoadingScreen />
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14
  }
});
