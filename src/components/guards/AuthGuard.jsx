import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '../../theme';
import useAuth from '../../hooks/useAuth';

const AuthGuard = ({ children, unauthenticatedFallback = null, loadingFallback }) => {
  const { colors } = useTheme();
  const { isAuthenticated, isHydrating } = useAuth();

  if (isHydrating) {
    if (loadingFallback) {
      return loadingFallback;
    }

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background
        }}
      >
        <ActivityIndicator size={40} color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return unauthenticatedFallback;
  }

  return children;
};

export default AuthGuard;

