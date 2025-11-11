import React, { useMemo, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import DynamicHeader from '../../components/navigation/DynamicHeader';
import { createSurfaceScrollStyles } from '../../theme/layout';

const ResourcesScreen = () => {
  const theme = useTheme();
  const { colors, spacing, typography } = theme;
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const scrollStyles = useMemo(() => createSurfaceScrollStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <DynamicHeader title="Resources" value={scrollOffsetY} />
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
        </Animated.ScrollView>
      </View>
    </View>
  );
};

export default ResourcesScreen;

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background
    }
  });

