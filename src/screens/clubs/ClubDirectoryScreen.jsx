import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, FlatList, ScrollView, Animated, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme';
import { useModal } from '../../context/ModalContext';
import DynamicHeader from '../../components/navigation/DynamicHeader';
import { createSurfaceScrollStyles } from '../../theme/layout';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getActiveClubTypes, getClubsPaginated } from '../../services/clubService';

const ClubDirectoryScreen = () => {
  const theme = useTheme();
  const { colors, spacing, typography, radii } = theme;
  const navigation = useNavigation();
  const { showToast } = useModal();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [clubTypes, setClubTypes] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingClubTypes, setLoadingClubTypes] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
    hasMore: false
  });
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const scrollStyles = useMemo(() => createSurfaceScrollStyles(theme), [theme]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch active club types on mount
  useEffect(() => {
    const fetchClubTypes = async () => {
      try {
        setLoadingClubTypes(true);
        setError(null);
        const response = await getActiveClubTypes();

        // API response structure: { success: true, statusCode: 200, message: "...", data: [...] }
        // Service returns response.data, so response = { success: true, data: [...] }
        let typesData = [];
        if (response && response.success && Array.isArray(response.data)) {
          typesData = response.data;
        }

        if (typesData.length > 0) {
          // Add "All" option at the beginning
          const typesWithAll = [
            { typeId: 'all', typeName: 'Tất cả', icon: 'apps' },
            ...typesData.map(type => ({
              ...type,
              icon: getIconForType(type.typeName)
            }))
          ];
          setClubTypes(typesWithAll);
        }
      } catch (err) {
        console.error('Error fetching club types:', err);
        setError('Không thể tải danh sách loại CLB');
        showToast('Không thể tải danh sách loại câu lạc bộ. Vui lòng thử lại.', 'error');
      } finally {
        setLoadingClubTypes(false);
      }
    };

    fetchClubTypes();
  }, []);

  // Fetch clubs when filters change
  const fetchClubs = useCallback(async (page = 1, append = false, searchTerm = debouncedSearchQuery, typeId = selectedType) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const pageSize = 10;
      const params = {
        page,
        pageSize,
        isActive: true,
        sortBy: 'name',
        sortDescending: false
      };

      if (searchTerm && searchTerm.trim()) {
        params.searchTerm = searchTerm.trim();
      }

      if (typeId && typeId !== 'all') {
        params.typeId = typeId;
      }

      const response = await getClubsPaginated(params);

      // API response structure: { success: true, statusCode: 200, message: "...", data: {...} }
      // Service returns response.data, so response = { success: true, data: {...} }
      if (response && response.success && response.data) {
        const clubsData = Array.isArray(response.data) ? response.data : (response.data.items || []);
        const paginationInfo = response.data.pagination || response.data;

        if (append) {
          setClubs(prev => [...prev, ...clubsData]);
        } else {
          setClubs(clubsData);
        }

        setPagination({
          page: paginationInfo.page || page,
          pageSize: paginationInfo.pageSize || pageSize,
          totalPages: paginationInfo.totalPages || Math.ceil((paginationInfo.totalCount || clubsData.length) / (paginationInfo.pageSize || pageSize)),
          totalCount: paginationInfo.totalCount || clubsData.length,
          hasMore: paginationInfo.hasMore !== undefined ? paginationInfo.hasMore : (paginationInfo.page < (paginationInfo.totalPages || 1))
        });
      } else {
        if (!append) {
          setClubs([]);
        }
        setPagination(prev => ({ ...prev, hasMore: false }));
      }
    } catch (err) {
      console.error('Error fetching clubs:', err);
      setError('Không thể tải danh sách CLB');
      showToast('Không thể tải danh sách câu lạc bộ. Vui lòng thử lại.', 'error');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearchQuery, selectedType]);

  // Fetch clubs when filters/search change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1, hasMore: false }));
    fetchClubs(1, false, debouncedSearchQuery, selectedType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, selectedType]);

  // Load more clubs
  const loadMore = useCallback(() => {
    if (!loadingMore && pagination.hasMore) {
      const nextPage = pagination.page + 1;
      fetchClubs(nextPage, true, debouncedSearchQuery, selectedType);
    }
  }, [loadingMore, pagination.hasMore, pagination.page, fetchClubs, debouncedSearchQuery, selectedType]);

  // Helper function to get icon for club type
  const getIconForType = useCallback((typeName) => {
    const name = typeName.toLowerCase();
    if (name.includes('công nghệ') || name.includes('đổi mới')) return 'code-slash';
    if (name.includes('kinh doanh') || name.includes('kinh tế')) return 'business';
    if (name.includes('nghệ thuật') || name.includes('văn hóa')) return 'musical-notes';
    if (name.includes('sự kiện') || name.includes('tình nguyện')) return 'heart';
    if (name.includes('thể thao')) return 'football';
    return 'people';
  }, []);


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
      onPress={() => navigation.navigate('ClubDetail', { clubId: item.clubId || item.id })}
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
            {item.clubName || item.name}
          </Text>
          <View style={styles.clubMeta}>
            {item.typeName && (
              <>
                <Ionicons name="pricetag" size={14} color={colors.textMuted} />
                <Text
                  style={{
                    fontSize: typography.caption.fontSize,
                    fontFamily: typography.caption.fontFamily,
                    color: colors.textMuted,
                    marginLeft: spacing.xs
                  }}
                >
                  {item.typeName}
                </Text>
              </>
            )}
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
        {item.shortDescription || item.fullDescription || item.description || ''}
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
          {loadingClubTypes ? (
            <View style={styles.filterLoadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text
                style={{
                  fontSize: typography.body.small.fontSize,
                  fontFamily: typography.body.small.fontFamily,
                  color: colors.textMuted,
                  marginLeft: spacing.sm
                }}
              >
                Đang tải loại CLB...
              </Text>
            </View>
          ) : clubTypes.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterContainer}
              contentContainerStyle={styles.filterContent}
            >
              {clubTypes.map((type) => (
                <Pressable
                  key={type.typeId}
                  onPress={() => setSelectedType(type.typeId)}
                  style={({ pressed }) => [
                    styles.filterChip,
                    {
                      backgroundColor: selectedType === type.typeId ? colors.primary : colors.surface,
                      borderColor: selectedType === type.typeId ? colors.primary : colors.border,
                      opacity: pressed ? 0.7 : 1
                    }
                  ]}
                >
                  <Ionicons
                    name={type.icon || 'people'}
                    size={16}
                    color={selectedType === type.typeId ? colors.background : colors.textMuted}
                    style={{ marginRight: spacing.xs }}
                  />
                  <Text
                    style={{
                      fontSize: typography.body.small.fontSize,
                      fontFamily: typography.body.small.fontFamily,
                      color: selectedType === type.typeId ? colors.background : colors.textPrimary
                    }}
                  >
                    {type.typeName}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          ) : null}

          {/* Loading State */}
          {loading && clubs.length === 0 && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text
                style={{
                  fontSize: typography.body.medium.fontSize,
                  fontFamily: typography.body.medium.fontFamily,
                  color: colors.textMuted,
                  marginTop: spacing.md
                }}
              >
                Đang tải danh sách CLB...
              </Text>
            </View>
          )}

          {/* Error State */}
          {error && !loading && (
            <View style={styles.errorContainer}>
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
                {error}
              </Text>
              <Pressable
                onPress={() => fetchClubs(1, false)}
                style={[styles.retryButton, { backgroundColor: colors.primary }]}
              >
                <Text
                  style={{
                    fontSize: typography.body.medium.fontSize,
                    fontFamily: typography.body.medium.fontFamily,
                    color: colors.background
                  }}
                >
                  Thử lại
                </Text>
              </Pressable>
            </View>
          )}

          {/* Results Count */}
          {!loading && !error && clubs.length > 0 && (
            <Text
              style={{
                fontSize: typography.body.small.fontSize,
                fontFamily: typography.body.small.fontFamily,
                color: colors.textMuted,
                marginTop: spacing.md,
                marginBottom: spacing.sm
              }}
            >
              Tìm thấy {pagination.totalCount} câu lạc bộ
            </Text>
          )}

          {/* No Data Found */}
          {!loading && !error && clubs.length === 0 && (
            <View style={styles.noDataContainer}>
              <Ionicons name="search-outline" size={64} color={colors.textMuted} />
              <Text
                style={{
                  fontSize: typography.heading.h4.fontSize,
                  fontFamily: typography.heading.h4.fontFamily,
                  color: colors.textPrimary,
                  marginTop: spacing.md,
                  marginBottom: spacing.xs
                }}
              >
                Không tìm thấy câu lạc bộ
              </Text>
              <Text
                style={{
                  fontSize: typography.body.medium.fontSize,
                  fontFamily: typography.body.medium.fontFamily,
                  color: colors.textMuted,
                  textAlign: 'center'
                }}
              >
                {searchQuery || selectedType !== 'all'
                  ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                  : 'Hiện tại chưa có câu lạc bộ nào'}
              </Text>
            </View>
          )}

          {/* Club List */}
          {!loading && !error && clubs.length > 0 && (
            <FlatList
              data={clubs}
              renderItem={renderClubCard}
              keyExtractor={item => (item.clubId || item.id).toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.clubsList}
              ListFooterComponent={
                loadingMore ? (
                  <View style={styles.loadingMoreContainer}>
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                ) : pagination.hasMore ? (
                  <Pressable
                    onPress={loadMore}
                    style={[styles.loadMoreButton, { borderColor: colors.border }]}
                  >
                    <Text
                      style={{
                        fontSize: typography.body.medium.fontSize,
                        fontFamily: typography.body.medium.fontFamily,
                        color: colors.primary
                      }}
                    >
                      Tải thêm
                    </Text>
                  </Pressable>
                ) : null
              }
            />
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
    filterLoadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      marginBottom: theme.spacing.md
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
    },
    loadingContainer: {
      padding: theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 200
    },
    errorContainer: {
      padding: theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 200
    },
    noDataContainer: {
      padding: theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 300
    },
    retryButton: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radii.md,
      marginTop: theme.spacing.md
    },
    loadingMoreContainer: {
      padding: theme.spacing.md,
      alignItems: 'center'
    },
    loadMoreButton: {
      padding: theme.spacing.md,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      alignItems: 'center',
      marginTop: theme.spacing.sm
    }
  });

export default ClubDirectoryScreen;

