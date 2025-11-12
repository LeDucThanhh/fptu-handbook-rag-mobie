import React, { useMemo, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useTheme } from '../../theme';
import useAuth from '../../hooks/useAuth';
import DynamicHeader from '../../components/navigation/DynamicHeader';
import { createSurfaceScrollStyles } from '../../theme/layout';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const theme = useTheme();
  const { colors, spacing, typography, radii } = theme;
  const { user } = useAuth();
  const navigation = useNavigation();
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const scrollStyles = useMemo(() => createSurfaceScrollStyles(theme), [theme]);

  // Mock notifications data
  const recentNotifications = [
    { id: 1, title: 'Thông báo học vụ mới', category: 'Học vụ', time: '2 giờ trước' },
    { id: 2, title: 'Sự kiện CLB sắp diễn ra', category: 'Sự kiện', time: '5 giờ trước' },
    { id: 3, title: 'Cập nhật quy định mới', category: 'Học vụ', time: '1 ngày trước' }
  ];

  return (
    <View style={styles.container}>
      <DynamicHeader title="Trang chủ" value={scrollOffsetY} />
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
          {/* Welcome Section */}
          <View
            style={{
              backgroundColor: colors.primary,
              padding: spacing.xl,
              borderRadius: radii.lg,
              marginBottom: spacing.xl
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
              Xin chào {user?.displayName ?? 'Sinh viên'}!
            </Text>
            <Text
              style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: typography.body.medium.fontSize,
                fontFamily: typography.body.medium.fontFamily
              }}
            >
              Khám phá thông tin và dịch vụ từ FPT Handbook
            </Text>
          </View>

          {/* Ask AI Button - Orange */}
          <Pressable
            onPress={() => {
              const parent = navigation.getParent();
              if (parent) {
                parent.navigate('AskAI');
              }
            }}
            style={({ pressed }) => [
              styles.askAIButton,
              {
                backgroundColor: pressed ? '#FF8A50' : '#FF9800',
                opacity: pressed ? 0.9 : 1
              }
            ]}
          >
            <View style={styles.askAIContent}>
              <Ionicons name="chatbubbles" size={32} color={colors.background} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text
                  style={{
                    fontSize: typography.heading.h4.fontSize,
                    fontFamily: typography.heading.h4.fontFamily,
                    color: colors.background,
                    marginBottom: spacing.xs
                  }}
                >
                  Hỏi AI
                </Text>
                <Text
                  style={{
                    fontSize: typography.body.small.fontSize,
                    fontFamily: typography.body.small.fontFamily,
                    color: 'rgba(255,255,255,0.9)'
                  }}
                >
                  Đặt câu hỏi về thông tin FPT Handbook
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.background} />
            </View>
          </Pressable>

          {/* Recent Notifications */}
          <View style={{ marginTop: spacing.xl }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
              <Text
                style={{
                  fontSize: typography.heading.h4.fontSize,
                  color: colors.textPrimary,
                  fontFamily: typography.heading.h4.fontFamily
                }}
              >
                Thông báo gần đây
              </Text>
              <Pressable onPress={() => {
                const parent = navigation.getParent();
                if (parent) {
                  parent.navigate('Notifications');
                } else {
                  navigation.navigate('Notifications');
                }
              }}>
                <Text
                  style={{
                    fontSize: typography.body.small.fontSize,
                    color: colors.primary,
                    fontFamily: typography.body.small.fontFamily
                  }}
                >
                  Xem tất cả
                </Text>
              </Pressable>
            </View>

            {recentNotifications.map((notif) => (
              <Pressable
                key={notif.id}
                style={({ pressed }) => [
                  styles.notificationCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1
                  }
                ]}
                onPress={() => {
                  const parent = navigation.getParent();
                  if (parent) {
                    parent.navigate('Notifications');
                  } else {
                    navigation.navigate('Notifications');
                  }
                }}
              >
                <View style={styles.notificationContent}>
                  <View style={[styles.notificationIcon, { backgroundColor: colors.primaryLight + '20' }]}>
                    <Ionicons name="notifications" size={20} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text
                      style={{
                        fontSize: typography.body.medium.fontSize,
                        fontFamily: typography.body.medium.fontFamily,
                        color: colors.textPrimary,
                        marginBottom: spacing.xs
                      }}
                    >
                      {notif.title}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text
                        style={{
                          fontSize: typography.caption.fontSize,
                          fontFamily: typography.caption.fontFamily,
                          color: colors.textMuted,
                          marginRight: spacing.sm
                        }}
                      >
                        {notif.category}
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.caption.fontSize,
                          fontFamily: typography.caption.fontFamily,
                          color: colors.textMuted
                        }}
                      >
                        • {notif.time}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Quick Shortcuts */}
          <View style={{ marginTop: spacing.xl }}>
            <Text
              style={{
                fontSize: typography.heading.h4.fontSize,
                color: colors.textPrimary,
                fontFamily: typography.heading.h4.fontFamily,
                marginBottom: spacing.md
              }}
            >
              Lối tắt
            </Text>

            <View style={styles.shortcutsGrid}>
              <Pressable
                style={({ pressed }) => [
                  styles.shortcutCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1
                  }
                ]}
                onPress={() => {
                  const parent = navigation.getParent();
                  if (parent) {
                    parent.navigate('Clubs');
                  }
                }}
              >
                <Ionicons name="people" size={32} color={colors.primary} />
                <Text
                  style={{
                    fontSize: typography.body.small.fontSize,
                    fontFamily: typography.body.small.fontFamily,
                    color: colors.textPrimary,
                    marginTop: spacing.sm,
                    textAlign: 'center'
                  }}
                >
                  Câu lạc bộ
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.shortcutCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1
                  }
                ]}
                onPress={() => {
                  const parent = navigation.getParent();
                  if (parent) {
                    parent.navigate('Notifications');
                  } else {
                    navigation.navigate('Notifications');
                  }
                }}
              >
                <Ionicons name="notifications-outline" size={32} color={colors.primary} />
                <Text
                  style={{
                    fontSize: typography.body.small.fontSize,
                    fontFamily: typography.body.small.fontFamily,
                    color: colors.textPrimary,
                    marginTop: spacing.sm,
                    textAlign: 'center'
                  }}
                >
                  Thông báo
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.shortcutCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1
                  }
                ]}
                onPress={() => {
                  const parent = navigation.getParent();
                  if (parent) {
                    parent.navigate('Profile');
                  }
                }}
              >
                <Ionicons name="person-outline" size={32} color={colors.primary} />
                <Text
                  style={{
                    fontSize: typography.body.small.fontSize,
                    fontFamily: typography.body.small.fontFamily,
                    color: colors.textPrimary,
                    marginTop: spacing.sm,
                    textAlign: 'center'
                  }}
                >
                  Cá nhân
                </Text>
              </Pressable>
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
    },
    askAIButton: {
      borderRadius: theme.radii.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5
    },
    askAIContent: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    notificationCard: {
      borderRadius: theme.radii.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1
    },
    notificationContent: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    notificationIcon: {
      width: 40,
      height: 40,
      borderRadius: theme.radii.sm,
      alignItems: 'center',
      justifyContent: 'center'
    },
    shortcutsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap'
    },
    shortcutCard: {
      width: '30%',
      aspectRatio: 1,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md
    }
  });

