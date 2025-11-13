import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const ConfirmationModal = ({ visible, title, message, confirmText = 'Xác nhận', cancelText = 'Hủy', onConfirm, onCancel, type = 'default' }) => {
  const theme = useTheme();
  const { colors, spacing, typography, radii, elevations } = theme;
  const styles = createStyles(theme);

  const getIconAndColor = () => {
    switch (type) {
      case 'danger':
        return { icon: 'warning', color: colors.danger };
      case 'warning':
        return { icon: 'alert-circle', color: colors.warning };
      case 'success':
        return { icon: 'checkmark-circle', color: colors.success };
      case 'info':
        return { icon: 'information-circle', color: colors.info };
      default:
        return { icon: 'help-circle', color: colors.primary };
    }
  };

  const { icon, color } = getIconAndColor();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.surface, borderRadius: radii.lg }]}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
              <Ionicons name={icon} size={48} color={color} />
            </View>
          </View>

          {title && (
            <Text style={[styles.title, { color: colors.textPrimary, fontFamily: typography.heading.h4.fontFamily }]}>
              {title}
            </Text>
          )}

          {message && (
            <Text style={[styles.message, { color: colors.textSecondary, fontFamily: typography.body.medium.fontFamily }]}>
              {message}
            </Text>
          )}

          <View style={styles.buttonContainer}>
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                {
                  backgroundColor: colors.surfaceAlt,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1
                }
              ]}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textPrimary, fontFamily: typography.body.medium.fontFamily }]}>
                {cancelText}
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.button,
                styles.confirmButton,
                {
                  backgroundColor: type === 'danger' ? colors.danger : color,
                  opacity: pressed ? 0.7 : 1
                }
              ]}
            >
              <Text style={[styles.confirmButtonText, { color: colors.background, fontFamily: typography.body.medium.fontFamily }]}>
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl
    },
    modalContainer: {
      width: '100%',
      maxWidth: 400,
      padding: theme.spacing.xl,
      ...theme.elevations.level3
    },
    iconContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.md
    },
    iconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center'
    },
    title: {
      fontSize: theme.typography.heading.h4.fontSize,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
      fontWeight: '600'
    },
    message: {
      fontSize: theme.typography.body.medium.fontSize,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
      lineHeight: 22
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md
    },
    button: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radii.md,
      alignItems: 'center',
      justifyContent: 'center'
    },
    cancelButton: {
      borderWidth: 1
    },
    confirmButton: {
      // backgroundColor set dynamically
    },
    cancelButtonText: {
      fontSize: theme.typography.body.medium.fontSize,
      fontWeight: '500'
    },
    confirmButtonText: {
      fontSize: theme.typography.body.medium.fontSize,
      fontWeight: '600'
    }
  });

export default ConfirmationModal;

