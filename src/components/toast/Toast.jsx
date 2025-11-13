import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const Toast = ({ visible, message, type = 'info', duration = 3000, onHide }) => {
  const theme = useTheme();
  const { colors, spacing, typography, radii, elevations } = theme;
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true
        })
      ]).start();

      // Auto hide
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideToast();
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true
      })
    ]).start(() => {
      if (onHide) {
        onHide();
      }
    });
  };

  if (!visible) return null;

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'checkmark-circle',
          backgroundColor: colors.success,
          iconColor: colors.background
        };
      case 'error':
        return {
          icon: 'close-circle',
          backgroundColor: colors.danger,
          iconColor: colors.background
        };
      case 'warning':
        return {
          icon: 'warning',
          backgroundColor: colors.warning,
          iconColor: colors.background
        };
      case 'info':
      default:
        return {
          icon: 'information-circle',
          backgroundColor: colors.info,
          iconColor: colors.background
        };
    }
  };

  const { icon, backgroundColor, iconColor } = getToastConfig();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          backgroundColor,
          borderRadius: radii.md
        }
      ]}
    >
      <Ionicons name={icon} size={24} color={iconColor} style={{ marginRight: spacing.sm }} />
      <Text style={[styles.message, { color: colors.background, fontFamily: typography.body.medium.fontFamily }]}>
        {message}
      </Text>
    </Animated.View>
  );
};

const createStyles = (theme, insets) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: insets.top + 10,
      left: theme.spacing.md,
      right: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      ...theme.elevations.level3,
      zIndex: 9999
    },
    message: {
      flex: 1,
      fontSize: theme.typography.body.medium.fontSize,
      fontWeight: '500'
    }
  });

export default Toast;

