import React, { useMemo } from 'react';
import { Animated, ImageBackground, StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme';

export const HEADER_MAX_HEIGHT = 150;
export const HEADER_MIN_HEIGHT = 90;
export const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const DEFAULT_BACKGROUND = {
  uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
};

const DynamicHeader = ({ title, scrollY, value, backgroundSource = DEFAULT_BACKGROUND }) => {
  const theme = useTheme();
  const driver = scrollY ?? value;

  const animatedValue = useMemo(() => {
    if (driver) {
      return driver;
    }
    return new Animated.Value(0);
  }, [driver]);

  const animatedHeaderHeight = animatedValue.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp'
  });

  const animatedOverlayOpacity = animatedValue.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [0, 0.45],
    extrapolate: 'clamp'
  });

  if (!driver) {
    console.warn('DynamicHeader requires a scroll animated value.');
  }

  return (
    <Animated.View style={[styles.container, { height: animatedHeaderHeight }]}>
      <ImageBackground source={backgroundSource} resizeMode="cover" style={StyleSheet.absoluteFillObject}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: theme.colors.primary, opacity: animatedOverlayOpacity }
          ]}
        />
      </ImageBackground>
      {title ? (
        <Animated.View style={styles.titleWrapper}>
          <Animated.Text
            style={{
              fontFamily: theme.typography.heading.h4.fontFamily,
              fontSize: theme.typography.heading.h4.fontSize,
              color: theme.colors.background,
              textAlign: 'center',
              paddingHorizontal: theme.spacing.xl
            }}
            numberOfLines={1}
          >
            {title}
          </Animated.Text>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  titleWrapper: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default DynamicHeader;

