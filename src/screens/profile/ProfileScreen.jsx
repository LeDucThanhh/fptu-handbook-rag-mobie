import React, { useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Alert, Linking } from 'react-native';
import { useTheme } from '../../theme';
import useAuth from '../../hooks/useAuth';
import { useModal } from '../../context/ModalContext';
import DynamicHeader from '../../components/navigation/DynamicHeader';
import { createSurfaceScrollStyles } from '../../theme/layout';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const theme = useTheme();
  const { colors, spacing, typography, radii } = theme;
  const { user, roles, signOut } = useAuth();
  const { showConfirmation, showToast } = useModal();
  const [language, setLanguage] = useState('vi'); // 'vi' or 'en'
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const scrollStyles = useMemo(() => createSurfaceScrollStyles(theme), [theme]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    showToast(`Ngôn ngữ đã được chuyển sang ${lang === 'vi' ? 'Tiếng Việt' : 'English'}`, 'success');
  };

  const handleHelp = () => {
    Alert.alert(
      'Trợ giúp',
      'Nếu bạn cần hỗ trợ, vui lòng liên hệ:\n\nEmail: support@fpt.edu.vn\nHotline: 1900-xxxx',
      [
        { text: 'Gửi email', onPress: () => Linking.openURL('mailto:support@fpt.edu.vn') },
        { text: 'Đóng', style: 'cancel' }
      ]
    );
  };

  const handleReportBug = () => {
    Alert.alert(
      'Báo lỗi',
      'Bạn muốn báo lỗi qua email hay trong ứng dụng?',
      [
        { text: 'Gửi email', onPress: () => Linking.openURL('mailto:bugs@fpt.edu.vn?subject=Báo lỗi ứng dụng') },
        { text: 'Trong ứng dụng', onPress: () => Alert.alert('Thông báo', 'Tính năng báo lỗi trong ứng dụng sẽ sớm được cập nhật.') },
        { text: 'Hủy', style: 'cancel' }
      ]
    );
  };

  const handleSignOut = async () => {
    const confirmed = await showConfirmation({
      title: 'Đăng xuất',
      message: 'Bạn có chắc chắn muốn đăng xuất?',
      confirmText: 'Đăng xuất',
      cancelText: 'Hủy',
      type: 'danger',
      onConfirm: signOut
    });
  };

  const renderSettingItem = (icon, title, subtitle, onPress, showChevron = true) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingItem,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.7 : 1
        }
      ]}
    >
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text
          style={{
            fontSize: typography.body.medium.fontSize,
            fontFamily: typography.body.medium.fontFamily,
            color: colors.textPrimary,
            marginBottom: spacing.xs
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              fontSize: typography.body.small.fontSize,
              fontFamily: typography.body.small.fontFamily,
              color: colors.textMuted
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {showChevron && <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <DynamicHeader title="Cá nhân & Cài đặt" value={scrollOffsetY} />
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
          {/* Personal Info */}
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
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: colors.primaryLight + '20' }]}>
                <Ionicons name="person" size={40} color={colors.primary} />
              </View>
            </View>
            <Text
              style={{
                fontSize: typography.heading.h4.fontSize,
                fontFamily: typography.heading.h4.fontFamily,
                color: colors.textPrimary,
                marginBottom: spacing.xs,
                textAlign: 'center'
              }}
            >
              {user?.displayName ?? 'Sinh viên'}
            </Text>
            <View style={styles.infoRow}>
              <Ionicons name="id-card-outline" size={16} color={colors.textMuted} />
              <Text
                style={{
                  fontSize: typography.body.small.fontSize,
                  fontFamily: typography.body.small.fontFamily,
                  color: colors.textMuted,
                  marginLeft: spacing.xs
                }}
              >
                MSSV: {user?.studentId ?? 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={16} color={colors.textMuted} />
              <Text
                style={{
                  fontSize: typography.body.small.fontSize,
                  fontFamily: typography.body.small.fontFamily,
                  color: colors.textMuted,
                  marginLeft: spacing.xs
                }}
              >
                {user?.email ?? 'email@fpt.edu.vn'}
              </Text>
            </View>
          </View>

          {/* Language Settings */}
          <View style={{ marginBottom: spacing.xl }}>
            <Text
              style={{
                fontSize: typography.heading.h5.fontSize,
                fontFamily: typography.heading.h5.fontFamily,
                color: colors.textPrimary,
                marginBottom: spacing.md
              }}
            >
              Cài đặt ngôn ngữ
            </Text>
            <View style={styles.languageContainer}>
              <Pressable
                onPress={() => handleLanguageChange('vi')}
                style={({ pressed }) => [
                  styles.languageOption,
                  {
                    backgroundColor: language === 'vi' ? colors.primary : colors.surface,
                    borderColor: language === 'vi' ? colors.primary : colors.border,
                    opacity: pressed ? 0.7 : 1
                  }
                ]}
              >
                <Text
                  style={{
                    fontSize: typography.body.medium.fontSize,
                    fontFamily: typography.body.medium.fontFamily,
                    color: language === 'vi' ? colors.background : colors.textPrimary
                  }}
                >
                  Tiếng Việt
                </Text>
                {language === 'vi' && <Ionicons name="checkmark" size={20} color={colors.background} />}
              </Pressable>
              <Pressable
                onPress={() => handleLanguageChange('en')}
                style={({ pressed }) => [
                  styles.languageOption,
                  {
                    backgroundColor: language === 'en' ? colors.primary : colors.surface,
                    borderColor: language === 'en' ? colors.primary : colors.border,
                    opacity: pressed ? 0.7 : 1
                  }
                ]}
              >
                <Text
                  style={{
                    fontSize: typography.body.medium.fontSize,
                    fontFamily: typography.body.medium.fontFamily,
                    color: language === 'en' ? colors.background : colors.textPrimary
                  }}
                >
                  English
                </Text>
                {language === 'en' && <Ionicons name="checkmark" size={20} color={colors.background} />}
              </Pressable>
            </View>
          </View>

          {/* Settings Section */}
          <View style={{ marginBottom: spacing.xl }}>
            <Text
              style={{
                fontSize: typography.heading.h5.fontSize,
                fontFamily: typography.heading.h5.fontFamily,
                color: colors.textPrimary,
                marginBottom: spacing.md
              }}
            >
              Hỗ trợ
            </Text>
            {renderSettingItem('help-circle-outline', 'Trợ giúp', 'Câu hỏi thường gặp và hướng dẫn', handleHelp)}
            {renderSettingItem('bug-outline', 'Báo lỗi', 'Gửi phản hồi về lỗi ứng dụng', handleReportBug)}
          </View>

          {/* Sign Out */}
          <Pressable
            onPress={handleSignOut}
            style={({ pressed }) => [
              styles.signOutButton,
              {
                backgroundColor: colors.danger,
                opacity: pressed ? 0.85 : 1
              }
            ]}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.background} style={{ marginRight: spacing.sm }} />
            <Text
              style={{
                fontFamily: typography.button.fontFamily,
                fontSize: typography.button.fontSize,
                color: colors.background
              }}
            >
              Đăng xuất
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
    },
    avatarContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.md
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center'
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing.xs
    },
    languageContainer: {
      gap: theme.spacing.sm
    },
    languageOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderRadius: theme.radii.md,
      borderWidth: 1
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      marginBottom: theme.spacing.sm
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: theme.radii.sm,
      backgroundColor: theme.colors.primaryLight + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md
    },
    settingContent: {
      flex: 1
    },
    signOutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radii.md,
      marginTop: theme.spacing.lg
    }
  });

