import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../theme';
import useAuth from '../../hooks/useAuth';

const LoginScreen = () => {
  const { colors, typography, spacing, radii } = useTheme();
  const { signIn } = useAuth();

  const handleMockLogin = useCallback(() => {
    signIn({
      token: 'local-dev-token',
      user: {
        id: 'local-user',
        displayName: 'FPTU Student',
        email: 'student@example.com'
      }
    });
  }, [signIn]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.xl,
        justifyContent: 'center'
      }}
    >
      <Text
        style={{
          fontSize: typography.heading.h2.fontSize,
          color: colors.textPrimary,
          marginBottom: spacing.lg,
          fontFamily: typography.heading.h2.fontFamily
        }}
      >
        Welcome to FPT Handbook
      </Text>
      <Text
        style={{
          fontSize: typography.body.medium.fontSize,
          color: colors.textSecondary,
          marginBottom: spacing.xl,
          fontFamily: typography.body.medium.fontFamily
        }}
      >
        This development build bypasses authentication. Tap below to continue.
      </Text>

      <Pressable
        onPress={handleMockLogin}
        style={({ pressed }) => ({
          backgroundColor: pressed ? colors.primaryDark : colors.primary,
          paddingVertical: spacing.md,
          borderRadius: radii.md,
          alignItems: 'center'
        })}
      >
        <Text
          style={{
            fontFamily: typography.button.fontFamily,
            fontSize: typography.button.fontSize,
            color: colors.background
          }}
        >
          Continue to app
        </Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;

