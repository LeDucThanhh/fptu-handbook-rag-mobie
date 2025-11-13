import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Linking, Animated, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme';
import { useModal } from '../../context/ModalContext';
import DynamicHeader from '../../components/navigation/DynamicHeader';
import { createSurfaceScrollStyles } from '../../theme/layout';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getClubById } from '../../services/clubService';

const ClubDetailScreen = () => {
  const theme = useTheme();
  const { colors, spacing, typography, radii } = theme;
  const route = useRoute();
  const navigation = useNavigation();
  const { showToast } = useModal();
  const { clubId } = route.params || {};
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const scrollStyles = useMemo(() => createSurfaceScrollStyles(theme), [theme]);

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch club details
  useEffect(() => {
    const fetchClubDetails = async () => {
      if (!clubId) {
        setError('Không tìm thấy ID câu lạc bộ');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getClubById(clubId);
        
        if (response.success && response.data) {
          setClub(response.data);
        } else {
          setError('Không thể tải thông tin câu lạc bộ');
        }
      } catch (err) {
        console.error('Error fetching club details:', err);
        setError('Không thể tải thông tin câu lạc bộ');
        showToast('Không thể tải thông tin câu lạc bộ. Vui lòng thử lại.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchClubDetails();
  }, [clubId]);

  const handleEmailPress = () => {
    if (club?.contactEmail) {
      Linking.openURL(`mailto:${club.contactEmail}`);
    }
  };

  const handleFanpagePress = () => {
    if (club?.facebookUrl) {
      Linking.openURL(club.facebookUrl);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <DynamicHeader title="Câu lạc bộ" value={scrollOffsetY} />
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            style={{
              fontSize: typography.body.medium.fontSize,
              fontFamily: typography.body.medium.fontFamily,
              color: colors.textMuted,
              marginTop: spacing.md
            }}
          >
            Đang tải thông tin...
          </Text>
        </View>
      </View>
    );
  }

  if (error || !club) {
    return (
      <View style={styles.container}>
        <DynamicHeader title="Câu lạc bộ" value={scrollOffsetY} />
        <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
          <Ionicons name="alert-circle" size={48} color={colors.error || colors.textMuted} />
          <Text
            style={{
              fontSize: typography.body.medium.fontSize,
              fontFamily: typography.body.medium.fontFamily,
              color: colors.textMuted,
              marginTop: spacing.md,
              textAlign: 'center'
            }}
          >
            {error || 'Không tìm thấy thông tin câu lạc bộ'}
          </Text>
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
          >
            <Text
              style={{
                fontSize: typography.body.medium.fontSize,
                fontFamily: typography.body.medium.fontFamily,
                color: colors.background
              }}
            >
              Quay lại
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DynamicHeader title={club.clubName || club.name || 'Câu lạc bộ'} value={scrollOffsetY} />
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
                  {club.clubName || club.name}
                </Text>
                {club.clubCode && (
                  <Text
                    style={{
                      fontSize: typography.body.small.fontSize,
                      fontFamily: typography.body.small.fontFamily,
                      color: colors.textMuted,
                      marginBottom: spacing.xs
                    }}
                  >
                    Mã: {club.clubCode}
                  </Text>
                )}
                <View style={styles.clubMeta}>
                  {club.typeName && (
                    <>
                      <Ionicons name="pricetag" size={16} color={colors.textMuted} />
                      <Text
                        style={{
                          fontSize: typography.body.small.fontSize,
                          fontFamily: typography.body.small.fontFamily,
                          color: colors.textMuted,
                          marginLeft: spacing.xs
                        }}
                      >
                        {club.typeName}
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>

            {(club.fullDescription || club.shortDescription) && (
              <Text
                style={{
                  fontSize: typography.body.medium.fontSize,
                  fontFamily: typography.body.medium.fontFamily,
                  color: colors.textSecondary,
                  marginTop: spacing.md,
                  lineHeight: 24
                }}
              >
                {club.fullDescription || club.shortDescription}
              </Text>
            )}
          </View>

          {/* Contact Information */}
          {(club.contactEmail || club.contactPhone || club.facebookUrl) && (
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
              {club.contactEmail && (
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
                    {club.contactEmail}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </Pressable>
              )}
              {club.contactPhone && (
                <Pressable
                  onPress={() => Linking.openURL(`tel:${club.contactPhone}`)}
                  style={({ pressed }) => [
                    styles.contactCard,
                    { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }
                  ]}
                >
                  <Ionicons name="call" size={24} color={colors.primary} />
                  <Text
                    style={{
                      fontSize: typography.body.medium.fontSize,
                      fontFamily: typography.body.medium.fontFamily,
                      color: colors.textPrimary,
                      marginLeft: spacing.md,
                      flex: 1
                    }}
                  >
                    {club.contactPhone}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </Pressable>
              )}
              {club.facebookUrl && (
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
              )}
            </View>
          )}
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
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl
    },
    errorContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl
    },
    retryButton: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radii.md,
      marginTop: theme.spacing.md
    }
  });

export default ClubDetailScreen;

