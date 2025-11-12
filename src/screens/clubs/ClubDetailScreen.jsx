import React, { useMemo, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Linking, Animated } from 'react-native';
import { useTheme } from '../../theme';
import DynamicHeader from '../../components/navigation/DynamicHeader';
import { createSurfaceScrollStyles } from '../../theme/layout';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

const ClubDetailScreen = () => {
  const theme = useTheme();
  const { colors, spacing, typography, radii } = theme;
  const route = useRoute();
  const navigation = useNavigation();
  const { clubId } = route.params || {};
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const scrollStyles = useMemo(() => createSurfaceScrollStyles(theme), [theme]);

  // Mock data - in real app, fetch from API using clubId
  const club = {
    id: clubId || 1,
    name: 'CLB Lập trình',
    type: 'Học thuật',
    description: 'Câu lạc bộ dành cho sinh viên yêu thích lập trình và phát triển phần mềm. Chúng tôi tổ chức các buổi workshop, hackathon và các hoạt động học tập thú vị.',
    members: 150,
    email: 'clb.laptrinh@fpt.edu.vn',
    fanpage: 'https://facebook.com/clb-laptrinh-fpt',
    management: [
      { role: 'Chủ nhiệm', name: 'Nguyễn Văn A', term: '2024-2025' },
      { role: 'Phó chủ nhiệm', name: 'Trần Thị B', term: '2024-2025' },
      { role: 'Thư ký', name: 'Lê Văn C', term: '2024-2025' }
    ],
    upcomingEvents: [
      { id: 1, title: 'Workshop React Native', date: '15/12/2024', time: '14:00' },
      { id: 2, title: 'Hackathon FPT 2024', date: '20/12/2024', time: '08:00' }
    ]
  };

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${club.email}`);
  };

  const handleFanpagePress = () => {
    Linking.openURL(club.fanpage);
  };

  return (
    <View style={styles.container}>
      <DynamicHeader title={club.name} value={scrollOffsetY} />
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
          {/* Club Info Card */}
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.clubHeader}>
              <View style={[styles.clubIconLarge, { backgroundColor: colors.primaryLight + '20' }]}>
                <Ionicons name="people" size={40} color={colors.primary} />
              </View>
              <View style={styles.clubHeaderInfo}>
                <Text
                  style={{
                    fontSize: typography.heading.h3.fontSize,
                    fontFamily: typography.heading.h3.fontFamily,
                    color: colors.textPrimary,
                    marginBottom: spacing.xs
                  }}
                >
                  {club.name}
                </Text>
                <View style={styles.clubMeta}>
                  <Ionicons name="pricetag" size={16} color={colors.textMuted} />
                  <Text
                    style={{
                      fontSize: typography.body.small.fontSize,
                      fontFamily: typography.body.small.fontFamily,
                      color: colors.textMuted,
                      marginLeft: spacing.xs
                    }}
                  >
                    {club.type}
                  </Text>
                  <Text style={{ marginHorizontal: spacing.xs, color: colors.textMuted }}>•</Text>
                  <Ionicons name="people" size={16} color={colors.textMuted} />
                  <Text
                    style={{
                      fontSize: typography.body.small.fontSize,
                      fontFamily: typography.body.small.fontFamily,
                      color: colors.textMuted,
                      marginLeft: spacing.xs
                    }}
                  >
                    {club.members} thành viên
                  </Text>
                </View>
              </View>
            </View>

            <Text
              style={{
                fontSize: typography.body.medium.fontSize,
                fontFamily: typography.body.medium.fontFamily,
                color: colors.textSecondary,
                marginTop: spacing.md,
                lineHeight: 24
              }}
            >
              {club.description}
            </Text>
          </View>

          {/* Management Board */}
          <View style={{ marginTop: spacing.xl }}>
            <Text
              style={{
                fontSize: typography.heading.h4.fontSize,
                fontFamily: typography.heading.h4.fontFamily,
                color: colors.textPrimary,
                marginBottom: spacing.md
              }}
            >
              Ban quản lý
            </Text>
            {club.management.map((member, index) => (
              <View
                key={index}
                style={[styles.managementCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={styles.managementInfo}>
                  <Text
                    style={{
                      fontSize: typography.body.medium.fontSize,
                      fontFamily: typography.body.medium.fontFamily,
                      color: colors.textPrimary,
                      fontWeight: '600'
                    }}
                  >
                    {member.role}
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.body.small.fontSize,
                      fontFamily: typography.body.small.fontFamily,
                      color: colors.textSecondary,
                      marginTop: spacing.xs
                    }}
                  >
                    {member.name}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: typography.caption.fontSize,
                    fontFamily: typography.caption.fontFamily,
                    color: colors.textMuted
                  }}
                >
                  Nhiệm kỳ: {member.term}
                </Text>
              </View>
            ))}
          </View>

          {/* Contact Information */}
          <View style={{ marginTop: spacing.xl }}>
            <Text
              style={{
                fontSize: typography.heading.h4.fontSize,
                fontFamily: typography.heading.h4.fontFamily,
                color: colors.textPrimary,
                marginBottom: spacing.md
              }}
            >
              Thông tin liên hệ
            </Text>
            <Pressable
              onPress={handleEmailPress}
              style={({ pressed }) => [
                styles.contactCard,
                { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <Ionicons name="mail" size={24} color={colors.primary} />
              <Text
                style={{
                  fontSize: typography.body.medium.fontSize,
                  fontFamily: typography.body.medium.fontFamily,
                  color: colors.textPrimary,
                  marginLeft: spacing.md,
                  flex: 1
                }}
              >
                {club.email}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </Pressable>
            <Pressable
              onPress={handleFanpagePress}
              style={({ pressed }) => [
                styles.contactCard,
                { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <Ionicons name="logo-facebook" size={24} color={colors.primary} />
              <Text
                style={{
                  fontSize: typography.body.medium.fontSize,
                  fontFamily: typography.body.medium.fontFamily,
                  color: colors.textPrimary,
                  marginLeft: spacing.md,
                  flex: 1
                }}
              >
                Fanpage
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </Pressable>
          </View>

          {/* Upcoming Events */}
          <View style={{ marginTop: spacing.xl, marginBottom: spacing.xl }}>
            <Text
              style={{
                fontSize: typography.heading.h4.fontSize,
                fontFamily: typography.heading.h4.fontFamily,
                color: colors.textPrimary,
                marginBottom: spacing.md
              }}
            >
              Sự kiện sắp diễn ra
            </Text>
            {club.upcomingEvents.map((event) => (
              <View
                key={event.id}
                style={[styles.eventCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={[styles.eventDate, { backgroundColor: colors.primaryLight + '20' }]}>
                  <Ionicons name="calendar" size={20} color={colors.primary} />
                </View>
                <View style={styles.eventInfo}>
                  <Text
                    style={{
                      fontSize: typography.body.medium.fontSize,
                      fontFamily: typography.body.medium.fontFamily,
                      color: colors.textPrimary,
                      fontWeight: '600',
                      marginBottom: spacing.xs
                    }}
                  >
                    {event.title}
                  </Text>
                  <View style={styles.eventMeta}>
                    <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                    <Text
                      style={{
                        fontSize: typography.body.small.fontSize,
                        fontFamily: typography.body.small.fontFamily,
                        color: colors.textMuted,
                        marginLeft: spacing.xs
                      }}
                    >
                      {event.date} • {event.time}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
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
    infoCard: {
      borderRadius: theme.radii.md,
      padding: theme.spacing.lg,
      borderWidth: 1
    },
    clubHeader: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    clubIconLarge: {
      width: 64,
      height: 64,
      borderRadius: theme.radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md
    },
    clubHeaderInfo: {
      flex: 1
    },
    clubMeta: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    managementCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      marginBottom: theme.spacing.sm
    },
    managementInfo: {
      flex: 1
    },
    contactCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      marginBottom: theme.spacing.sm
    },
    eventCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      marginBottom: theme.spacing.sm
    },
    eventDate: {
      width: 48,
      height: 48,
      borderRadius: theme.radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md
    },
    eventInfo: {
      flex: 1
    },
    eventMeta: {
      flexDirection: 'row',
      alignItems: 'center'
    }
  });

export default ClubDetailScreen;

