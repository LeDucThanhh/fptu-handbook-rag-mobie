import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme';
import useAuth from '../../hooks/useAuth';

const RoleGuard = ({ children, roles, fallback }) => {
  const { colors, typography } = useTheme();
  const { hasRole } = useAuth();

  const allowed = hasRole(roles);

  if (!allowed) {
    if (fallback) {
      return fallback;
    }

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 32,
          backgroundColor: colors.background
        }}
      >
        <Text
          style={{
            fontSize: typography.body.medium.fontSize,
            color: colors.textSecondary,
            textAlign: 'center',
            fontFamily: typography.body.medium.fontFamily
          }}
        >
          You do not have permission to access this content.
        </Text>
      </View>
    );
  }

  return children;
};

export default RoleGuard;

