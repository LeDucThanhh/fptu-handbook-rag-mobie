import React, { useState, useMemo, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, ScrollView, Animated } from 'react-native';
import { useTheme } from '../../theme';
import DynamicHeader from '../../components/navigation/DynamicHeader';
import { createSurfaceScrollStyles } from '../../theme/layout';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
  { id: 'all', label: 'Tất cả', icon: 'apps' },
  { id: 'academic', label: 'Học vụ', icon: 'school' },
  { id: 'events', label: 'Sự kiện', icon: 'calendar' },
  { id: 'clubs', label: 'CLB', icon: 'people' }
];

// Mock data
const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Thông báo lịch thi cuối kỳ', category: 'academic', content: 'Lịch thi cuối kỳ đã được cập nhật. Vui lòng kiểm tra trên hệ thống.', time: '2 giờ trước', source: 'Academic Office' },
  { id: 2, title: 'Sự kiện Hackathon FPT 2024', category: 'events', content: 'Đăng ký tham gia Hackathon FPT 2024 từ ngày 15/12 đến 20/12.', time: '5 giờ trước', source: 'Student Affairs' },
  { id: 3, title: 'CLB Lập trình tuyển thành viên', category: 'clubs', content: 'CLB Lập trình đang tuyển thành viên mới. Đăng ký ngay!', time: '1 ngày trước', source: 'CLB Lập trình' },
  { id: 4, title: 'Cập nhật quy định học tập', category: 'academic', content: 'Quy định học tập mới đã được cập nhật. Vui lòng xem chi tiết.', time: '1 ngày trước', source: 'Academic Office' },
  { id: 5, title: 'Workshop React Native', category: 'events', content: 'Tham gia workshop React Native vào ngày 15/12/2024.', time: '2 ngày trước', source: 'Student Affairs' },
  { id: 6, title: 'CLB Bóng đá tập luyện', category: 'clubs', content: 'Lịch tập luyện mới của CLB Bóng đá đã được cập nhật.', time: '3 ngày trước', source: 'CLB Bóng đá' }
];

const NotificationsScreen = () => {
  const theme = useTheme();
  const { colors, spacing, typography, radii } = theme;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const scrollStyles = useMemo(() => createSurfaceScrollStyles(theme), [theme]);

  const filteredNotifications = useMemo(() => {
    if (selectedCategory === 'all') {
      return MOCK_NOTIFICATIONS;
    }
    return MOCK_NOTIFICATIONS.filter(notif => notif.category === selectedCategory);
  }, [selectedCategory]);

  const getCategoryIcon = (category) => {
    const categoryMap = {
      academic: 'school',
      events: 'calendar',
      clubs: 'people'
    };
    return categoryMap[category] || 'notifications';
  };

  const renderNotification = ({ item }) => (
    <Pressable
      style={({ pressed }) => [
        styles.notificationCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.7 : 1
        }
      ]}
    >
      <View style={styles.notificationHeader}>
        <View style={[styles.notificationIcon, { backgroundColor: colors.primaryLight + '20' }]}>
          <Ionicons name={getCategoryIcon(item.category)} size={24} color={colors.primary} />
        </View>
        <View style={styles.notificationContent}>
          <Text
            style={{
              fontSize: typography.heading.h6.fontSize,
              fontFamily: typography.heading.h6.fontFamily,
              color: colors.textPrimary,
              marginBottom: spacing.xs
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: typography.body.small.fontSize,
              fontFamily: typography.body.small.fontFamily,
              color: colors.textSecondary,
              marginBottom: spacing.xs,
              lineHeight: 20
            }}
            numberOfLines={2}
          >
            {item.content}
          </Text>
          <View style={styles.notificationMeta}>
            <Text
              style={{
                fontSize: typography.caption.fontSize,
                fontFamily: typography.caption.fontFamily,
                color: colors.textMuted
              }}
            >
              {item.source}
            </Text>
            <Text style={{ marginHorizontal: spacing.xs, color: colors.textMuted }}>•</Text>
            <Text
              style={{
                fontSize: typography.caption.fontSize,
                fontFamily: typography.caption.fontFamily,
                color: colors.textMuted
              }}
            >
              {item.time}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  const scrollHandler = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
    { useNativeDriver: false }
  );

  return (
    <View style={styles.container}>
      <DynamicHeader title="Thông báo" value={scrollOffsetY} />
      <View style={scrollStyles.wrapper}>
        <Animated.ScrollView
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          onScroll={scrollHandler}
          contentContainerStyle={scrollStyles.content}
        >
          {/* Category Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsContainer}
            contentContainerStyle={styles.tabsContent}
          >
            {CATEGORIES.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={({ pressed }) => [
                  styles.tab,
                  {
                    backgroundColor: selectedCategory === category.id ? colors.primary : colors.surface,
                    borderColor: selectedCategory === category.id ? colors.primary : colors.border,
                    opacity: pressed ? 0.7 : 1
                  }
                ]}
              >
                <Ionicons
                  name={category.icon}
                  size={18}
                  color={selectedCategory === category.id ? colors.background : colors.textMuted}
                  style={{ marginRight: spacing.xs }}
                />
                <Text
                  style={{
                    fontSize: typography.body.small.fontSize,
                    fontFamily: typography.body.small.fontFamily,
                    color: selectedCategory === category.id ? colors.background : colors.textPrimary
                  }}
                >
                  {category.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Notifications List */}
          <View style={{ marginTop: spacing.md }}>
            <Text
              style={{
                fontSize: typography.body.small.fontSize,
                fontFamily: typography.body.small.fontFamily,
                color: colors.textMuted,
                marginBottom: spacing.sm
              }}
            >
              {filteredNotifications.length} thông báo
            </Text>
            <FlatList
              data={filteredNotifications}
              renderItem={renderNotification}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.notificationsList}
            />
          </View>
        </Animated.ScrollView>
      </View>
    </View>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background
    },
    tabsContainer: {
      marginBottom: theme.spacing.md
    },
    tabsContent: {
      paddingRight: theme.spacing.xl
    },
    tab: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radii.pill,
      borderWidth: 1,
      marginRight: theme.spacing.sm
    },
    notificationsList: {
      paddingBottom: 100 // Tab bar height + extra space
    },
    notificationCard: {
      borderRadius: theme.radii.md,
      padding: theme.spacing.md,
      borderWidth: 1,
      marginBottom: theme.spacing.md
    },
    notificationHeader: {
      flexDirection: 'row'
    },
    notificationIcon: {
      width: 48,
      height: 48,
      borderRadius: theme.radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md
    },
    notificationContent: {
      flex: 1
    },
    notificationMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.xs
    }
  });

export default NotificationsScreen;
