import React, { useMemo, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import useAuth from '../../hooks/useAuth';
import DynamicHeader from '../../components/navigation/DynamicHeader';
import { createSurfaceScrollStyles } from '../../theme/layout';

const HomeScreen = () => {
  const theme = useTheme();
  const { colors, spacing, typography, radii } = theme;
  const { user } = useAuth();
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const scrollStyles = useMemo(() => createSurfaceScrollStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <DynamicHeader title="Home" value={scrollOffsetY} />
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
              Explore the latest updates and resources from the handbook team.
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
        </Animated.ScrollView>
      </View>
    </View>
  );
};

export default HomeScreen;

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background
    }
  });

