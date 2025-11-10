import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../../theme';
import useAuth from '../../hooks/useAuth';

const HomeScreen = () => {
  const { colors, spacing, typography, radii } = useTheme();
  const { user } = useAuth();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.xl }}
    >
      <View
        style={{
          backgroundColor: colors.primary,
          padding: spacing.xl,
          borderRadius: radii.lg
        }}
      >
        <Text
          style={{
            color: colors.background,
            fontSize: typography.heading.h3.fontSize,
            fontFamily: typography.heading.h3.fontFamily,
            marginBottom: spacing.sm
          }}
        >
          Hello {user?.displayName ?? 'there'}!
        </Text>
        <Text
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: typography.body.medium.fontSize,
            fontFamily: typography.body.medium.fontFamily
          }}
        >
          Explore resources tailored to your role.
        </Text>
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <Text
          style={{
            fontSize: typography.heading.h4.fontSize,
            color: colors.textPrimary,
            fontFamily: typography.heading.h4.fontFamily,
            marginBottom: spacing.md
          }}
        >
          Quick Actions
        </Text>

        <View
          style={{
            backgroundColor: colors.surface,
            padding: spacing.lg,
            borderRadius: radii.md,
            borderWidth: 1,
            borderColor: colors.border
          }}
        >
          <Text
            style={{
              fontSize: typography.body.medium.fontSize,
              color: colors.textSecondary,
              fontFamily: typography.body.medium.fontFamily
            }}
          >
            Coming soon: quick shortcuts to your frequently used handbook modules.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

