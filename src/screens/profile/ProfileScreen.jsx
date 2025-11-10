import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../theme';
import useAuth from '../../hooks/useAuth';

const ProfileScreen = () => {
  const { colors, spacing, typography, radii } = useTheme();
  const { user, signOut } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.xl
      }}
    >
      <Text
        style={{
          fontSize: typography.heading.h3.fontSize,
          color: colors.textPrimary,
          fontFamily: typography.heading.h3.fontFamily,
          marginBottom: spacing.lg
        }}
      >
        Profile
      </Text>

      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: radii.md,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: spacing.xl
        }}
      >
        <Text
          style={{
            fontSize: typography.body.large.fontSize,
            fontFamily: typography.body.large.fontFamily,
            color: colors.textPrimary,
            marginBottom: spacing.xs
          }}
        >
          {user?.displayName ?? 'User'}
        </Text>
        <Text
          style={{
            fontSize: typography.body.medium.fontSize,
            fontFamily: typography.body.medium.fontFamily,
            color: colors.textSecondary,
            marginBottom: spacing.xs
          }}
        >
          {user?.email ?? 'email@example.com'}
        </Text>
      </View>

      <Pressable
        onPress={signOut}
        style={({ pressed }) => ({
          backgroundColor: pressed ? colors.danger : colors.danger,
          opacity: pressed ? 0.85 : 1,
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
          Sign out
        </Text>
      </Pressable>
    </View>
  );
};

export default ProfileScreen;

