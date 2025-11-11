import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

import { ThemeProvider } from './src/theme';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync().catch(() => {
  // ignore rejections, app will continue with default splash behaviour
});

export default function App() {
  const [fontsLoaded, fontsError] = useFonts({
    Urbanist_400Regular: require('./assets/static/Urbanist-Regular.ttf'),
    Urbanist_500Medium: require('./assets/static/Urbanist-Medium.ttf'),
    Urbanist_600SemiBold: require('./assets/static/Urbanist-SemiBold.ttf'),
    Urbanist_700Bold: require('./assets/static/Urbanist-Bold.ttf'),
    Urbanist_800ExtraBold: require('./assets/static/Urbanist-ExtraBold.ttf')
  });

  useEffect(() => {
    if (fontsError) {
      console.warn('Failed to load fonts', fontsError);
    }

    if (fontsLoaded || fontsError) {
      SplashScreen.hideAsync().catch(() => {
        // ignore hide errors
      });
    }
  }, [fontsLoaded, fontsError]);

  if (!fontsLoaded && !fontsError) {
    return null;
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
