import React, { useState, useMemo, useRef } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, FlatList, ScrollView, Animated } from 'react-native';
import { useTheme } from '../../theme';
import DynamicHeader from '../../components/navigation/DynamicHeader';
import { createSurfaceScrollStyles } from '../../theme/layout';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CLUB_TYPES = [
  { id: 'all', label: 'Tất cả', icon: 'apps' },
  { id: 'academic', label: 'Học thuật', icon: 'school' },
  { id: 'sports', label: 'Thể thao', icon: 'football' },
  { id: 'cultural', label: 'Văn hóa', icon: 'musical-notes' },
  { id: 'social', label: 'Xã hội', icon: 'people' }
];

// Mock data
const MOCK_CLUBS = [
  { id: 1, name: 'CLB Lập trình', type: 'academic', description: 'Câu lạc bộ dành cho sinh viên yêu thích lập trình', members: 150 },
  { id: 2, name: 'CLB Bóng đá', type: 'sports', description: 'Câu lạc bộ bóng đá FPT', members: 80 },
  { id: 3, name: 'CLB Nhạc cụ', type: 'cultural', description: 'Câu lạc bộ âm nhạc và nhạc cụ', members: 60 },
  { id: 4, name: 'CLB Tình nguyện', type: 'social', description: 'Câu lạc bộ hoạt động tình nguyện', members: 200 },
  { id: 5, name: 'CLB AI/ML', type: 'academic', description: 'Câu lạc bộ Trí tuệ nhân tạo và Machine Learning', members: 120 },
  { id: 6, name: 'CLB Bóng rổ', type: 'sports', description: 'Câu lạc bộ bóng rổ FPT', members: 45 },
  { id: 7, name: 'CLB Khiêu vũ', type: 'cultural', description: 'Câu lạc bộ khiêu vũ và nhảy', members: 70 },
  { id: 8, name: 'CLB Môi trường', type: 'social', description: 'Câu lạc bộ bảo vệ môi trường', members: 90 }
];

const ClubDirectoryScreen = () => {
  const theme = useTheme();
  const { colors, spacing, typography, radii } = theme;
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const scrollStyles = useMemo(() => createSurfaceScrollStyles(theme), [theme]);

  const filteredClubs = useMemo(() => {
    return MOCK_CLUBS.filter(club => {
      const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           club.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || club.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedType]);

  const renderClubCard = ({ item }) => (
    <Pressable
      style={({ pressed }) => [
        styles.clubCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.7 : 1
        }
      ]}
      onPress={() => navigation.navigate('ClubDetail', { clubId: item.id })}
    >
      <View style={styles.clubCardHeader}>
        <View style={[styles.clubIcon, { backgroundColor: colors.primaryLight + '20' }]}>
          <Ionicons name="people" size={24} color={colors.primary} />
        </View>
        <View style={styles.clubCardInfo}>
          <Text
            style={{
              fontSize: typography.heading.h5.fontSize,
              fontFamily: typography.heading.h5.fontFamily,
              color: colors.textPrimary,
              marginBottom: spacing.xs
            }}
          >
            {item.name}
          </Text>
          <View style={styles.clubMeta}>
            <Ionicons name="people-outline" size={14} color={colors.textMuted} />
            <Text
              style={{
                fontSize: typography.caption.fontSize,
                fontFamily: typography.caption.fontFamily,
                color: colors.textMuted,
                marginLeft: spacing.xs
              }}
            >
              {item.members} thành viên
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </View>
      <Text
        style={{
          fontSize: typography.body.small.fontSize,
          fontFamily: typography.body.small.fontFamily,
          color: colors.textSecondary,
          marginTop: spacing.sm
        }}
        numberOfLines={2}
      >
        {item.description}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <DynamicHeader title="Câu lạc bộ" value={scrollOffsetY} />
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
          {/* Search Bar */}
          <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="search" size={20} color={colors.textMuted} style={{ marginRight: spacing.sm }} />
            <TextInput
              style={{
                flex: 1,
                fontSize: typography.body.medium.fontSize,
                fontFamily: typography.body.medium.fontFamily,
                color: colors.textPrimary
              }}
              placeholder="Tìm kiếm CLB theo tên, loại hình..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.textMuted} />
              </Pressable>
            )}
          </View>

          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContent}
          >
            {CLUB_TYPES.map((type) => (
              <Pressable
                key={type.id}
                onPress={() => setSelectedType(type.id)}
                style={({ pressed }) => [
                  styles.filterChip,
                  {
                    backgroundColor: selectedType === type.id ? colors.primary : colors.surface,
                    borderColor: selectedType === type.id ? colors.primary : colors.border,
                    opacity: pressed ? 0.7 : 1
                  }
                ]}
              >
                <Ionicons
                  name={type.icon}
                  size={16}
                  color={selectedType === type.id ? colors.background : colors.textMuted}
                  style={{ marginRight: spacing.xs }}
                />
                <Text
                  style={{
                    fontSize: typography.body.small.fontSize,
                    fontFamily: typography.body.small.fontFamily,
                    color: selectedType === type.id ? colors.background : colors.textPrimary
                  }}
                >
                  {type.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Results Count */}
          <Text
            style={{
              fontSize: typography.body.small.fontSize,
              fontFamily: typography.body.small.fontFamily,
              color: colors.textMuted,
              marginTop: spacing.md,
              marginBottom: spacing.sm
            }}
          >
            Tìm thấy {filteredClubs.length} câu lạc bộ
          </Text>

          {/* Club List */}
          <FlatList
            data={filteredClubs}
            renderItem={renderClubCard}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.clubsList}
          />
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
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      marginBottom: theme.spacing.md
    },
    filterContainer: {
      marginBottom: theme.spacing.md
    },
    filterContent: {
      paddingRight: theme.spacing.xl
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radii.pill,
      borderWidth: 1,
      marginRight: theme.spacing.sm
    },
    clubsList: {
      paddingBottom: 100 // Tab bar height + extra space
    },
    clubCard: {
      borderRadius: theme.radii.md,
      padding: theme.spacing.md,
      borderWidth: 1,
      marginBottom: theme.spacing.md
    },
    clubCardHeader: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    clubIcon: {
      width: 48,
      height: 48,
      borderRadius: theme.radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md
    },
    clubCardInfo: {
      flex: 1
    },
    clubMeta: {
      flexDirection: 'row',
      alignItems: 'center'
    }
  });

export default ClubDirectoryScreen;

