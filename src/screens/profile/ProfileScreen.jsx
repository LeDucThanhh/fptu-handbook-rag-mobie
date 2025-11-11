import React, { useMemo, useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import useAuth from '../../hooks/useAuth';
import DynamicHeader from '../../components/navigation/DynamicHeader';
import { createSurfaceScrollStyles } from '../../theme/layout';

const ProfileScreen = () => {
  const theme = useTheme();
  const { colors, spacing, typography, radii } = theme;
  const { user, roles, signOut } = useAuth();
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const scrollStyles = useMemo(() => createSurfaceScrollStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <DynamicHeader title="Profile" value={scrollOffsetY} />
      <View style={scrollStyles.wrapper}>
        <Animated.ScrollView
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
            { useNativeDriver: false }
          )}
          contentContainerStyle={scrollStyles.content}
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
              backgroundColor: colors.surfaceAlt ?? colors.surface,
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
            <Text
              style={{
                fontSize: typography.caption.fontSize,
                fontFamily: typography.caption.fontFamily,
                color: colors.textMuted
              }}
            >
              Roles: {roles?.length ? roles.join(', ') : 'N/A'}
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
        </Animated.ScrollView>
      </View>
    </View>
  );
};

export default ProfileScreen;

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background
    }
  });

