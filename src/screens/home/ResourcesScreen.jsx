import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme';

const ResourcesScreen = () => {
  const { colors, spacing, typography } = useTheme();

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
          marginBottom: spacing.md
        }}
      >
        Resources
      </Text>
      <Text
        style={{
          fontSize: typography.body.medium.fontSize,
          color: colors.textSecondary,
          fontFamily: typography.body.medium.fontFamily,
          lineHeight: typography.body.medium.lineHeight
        }}
      >
        Personalized resources and quick links will appear here once the feature is connected to the backend.
      </Text>
    </View>
  );
};

export default ResourcesScreen;

