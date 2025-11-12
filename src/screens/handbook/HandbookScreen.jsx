import React, { useState, useMemo, useRef } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, FlatList, ScrollView, Animated } from 'react-native';
import { useTheme } from '../../theme';
import DynamicHeader from '../../components/navigation/DynamicHeader';
import { createSurfaceScrollStyles } from '../../theme/layout';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HANDBOOK_CATEGORIES = [
  { id: 'all', label: 'Tất cả', icon: 'apps' },
  { id: 'academic', label: 'Học vụ', icon: 'school' },
  { id: 'regulations', label: 'Quy định', icon: 'document-text' },
  { id: 'services', label: 'Dịch vụ', icon: 'business' },
  { id: 'campus', label: 'Cơ sở', icon: 'location' }
];

// Mock data - Sổ tay FPT
const HANDBOOK_ITEMS = [
  { 
    id: 1, 
    title: 'Quy định học tập và thi cử', 
    category: 'academic', 
    description: 'Các quy định về học tập, thi cử, điểm số và tốt nghiệp',
    icon: 'school'
  },
  { 
    id: 2, 
    title: 'Quy định về học phí', 
    category: 'regulations', 
    description: 'Thông tin về học phí, học bổng và các khoản phí khác',
    icon: 'cash'
  },
  { 
    id: 3, 
    title: 'Dịch vụ thư viện', 
    category: 'services', 
    description: 'Hướng dẫn sử dụng thư viện, mượn sách và tài liệu',
    icon: 'library'
  },
  { 
    id: 4, 
    title: 'Quy định về ký túc xá', 
    category: 'regulations', 
    description: 'Nội quy và quy định sinh hoạt tại ký túc xá',
    icon: 'home'
  },
  { 
    id: 5, 
    title: 'Dịch vụ y tế', 
    category: 'services', 
    description: 'Thông tin về phòng y tế và dịch vụ chăm sóc sức khỏe',
    icon: 'medical'
  },
  { 
    id: 6, 
    title: 'Cơ sở vật chất', 
    category: 'campus', 
    description: 'Thông tin về các tòa nhà, phòng học và cơ sở vật chất',
    icon: 'business'
  },
  { 
    id: 7, 
    title: 'Quy trình đăng ký môn học', 
    category: 'academic', 
    description: 'Hướng dẫn chi tiết về cách đăng ký môn học mỗi kỳ',
    icon: 'list'
  },
  { 
    id: 8, 
    title: 'Quy định về thực tập', 
    category: 'academic', 
    description: 'Thông tin về quy trình và yêu cầu thực tập tốt nghiệp',
    icon: 'briefcase'
  }
];

const HandbookScreen = () => {
  const theme = useTheme();
  const { colors, spacing, typography, radii } = theme;
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const scrollStyles = useMemo(() => createSurfaceScrollStyles(theme), [theme]);

  const filteredItems = useMemo(() => {
    return HANDBOOK_ITEMS.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const scrollHandler = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
    { useNativeDriver: false }
  );

  const renderHandbookItem = ({ item }) => (
    <Pressable
      style={({ pressed }) => [
        styles.handbookCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.7 : 1
        }
      ]}
      onPress={() => {
        // TODO: Navigate to detail screen
        console.log('Open handbook item:', item.id);
      }}
    >
      <View style={styles.handbookCardHeader}>
        <View style={[styles.handbookIcon, { backgroundColor: colors.primaryLight + '20' }]}>
          <Ionicons name={item.icon} size={28} color={colors.primary} />
        </View>
        <View style={styles.handbookCardInfo}>
          <Text
            style={{
              fontSize: typography.heading.h5.fontSize,
              fontFamily: typography.heading.h5.fontFamily,
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
              lineHeight: 20
            }}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <DynamicHeader title="Sổ tay" value={scrollOffsetY} />
      <View style={scrollStyles.wrapper}>
        <Animated.ScrollView
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          onScroll={scrollHandler}
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
              placeholder="Tìm kiếm trong sổ tay..."
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

          {/* Category Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContent}
          >
            {HANDBOOK_CATEGORIES.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={({ pressed }) => [
                  styles.filterChip,
                  {
                    backgroundColor: selectedCategory === category.id ? colors.primary : colors.surface,
                    borderColor: selectedCategory === category.id ? colors.primary : colors.border,
                    opacity: pressed ? 0.7 : 1
                  }
                ]}
              >
                <Ionicons
                  name={category.icon}
                  size={16}
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
            Tìm thấy {filteredItems.length} mục
          </Text>

          {/* Handbook Items List */}
          <FlatList
            data={filteredItems}
            renderItem={renderHandbookItem}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.handbookList}
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
    handbookList: {
      paddingBottom: 100 // Tab bar height + extra space
    },
    handbookCard: {
      borderRadius: theme.radii.md,
      padding: theme.spacing.md,
      borderWidth: 1,
      marginBottom: theme.spacing.md
    },
    handbookCardHeader: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    handbookIcon: {
      width: 56,
      height: 56,
      borderRadius: theme.radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md
    },
    handbookCardInfo: {
      flex: 1
    }
  });

export default HandbookScreen;

