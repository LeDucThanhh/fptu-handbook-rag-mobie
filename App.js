import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

import { ThemeProvider } from './src/theme';
import { AuthProvider } from './src/context/AuthContext';
import { ModalProvider } from './src/context/ModalContext';
import AppNavigator from './src/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync().catch(() => {
  // ignore rejections, app will continue with default splash behaviour
});

export default function App() {
  const [fontsLoaded, fontsError] = useFonts({
    // Dongle fonts
    Dongle_300Light: require('./assets/static/Dongle-Light.ttf'),
    Dongle_400Regular: require('./assets/static/Dongle-Regular.ttf'),
    Dongle_700Bold: require('./assets/static/Dongle-Bold.ttf')
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
          <ModalProvider>
            <StatusBar style="dark" />
            <AppNavigator />
          </ModalProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
