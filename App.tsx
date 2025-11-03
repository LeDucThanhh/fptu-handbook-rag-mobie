/**
 * FPTU Handbook RAG Mobile App
 *
 * @format
 */

import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider as AntdProvider} from '@ant-design/react-native';
import {AuthProvider} from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import {antdTheme} from './src/theme';
import './src/i18n';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AntdProvider theme={antdTheme}>
        <AuthProvider>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor="#FF6B35"
          />
          <AppNavigator />
        </AuthProvider>
      </AntdProvider>
    </GestureHandlerRootView>
  );
}

export default App;
