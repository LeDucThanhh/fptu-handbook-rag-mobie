import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RootStackParamList, MainTabParamList} from '../navigation/AppNavigator';

type ClubDirectoryNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Clubs'>,
  StackNavigationProp<RootStackParamList>
>;

interface Club {
  id: string;
  name: string;
  type: 'academic' | 'sports' | 'cultural' | 'social';
  description: string;
  logo?: string;
}

const ClubDirectoryScreen = () => {
  const navigation = useNavigation<ClubDirectoryNavigationProp>();
  const {t} = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Mock clubs data
  const allClubs: Club[] = [
    {
      id: '1',
      name: 'CLB Lập trình',
      type: 'academic',
      description: 'Câu lạc bộ dành cho sinh viên yêu thích lập trình',
    },
    {
      id: '2',
      name: 'CLB Bóng đá',
      type: 'sports',
      description: 'Câu lạc bộ thể thao bóng đá cho sinh viên',
    },
    {
      id: '3',
      name: 'CLB Văn nghệ',
      type: 'cultural',
      description: 'Câu lạc bộ văn nghệ, nghệ thuật',
    },
    {
      id: '4',
      name: 'CLB Tình nguyện',
      type: 'social',
      description: 'Câu lạc bộ hoạt động xã hội, tình nguyện',
    },
  ];

  const filters = [
    {id: 'all', label: t('clubs.allTypes')},
    {id: 'academic', label: t('clubs.academic')},
    {id: 'sports', label: t('clubs.sports')},
    {id: 'cultural', label: t('clubs.cultural')},
    {id: 'social', label: t('clubs.social')},
  ];

  const filteredClubs = allClubs.filter(club => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === 'all' || club.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleClubPress = (clubId: string) => {
    navigation.navigate('ClubDetail', {clubId});
  };

  const renderClub = ({item}: {item: Club}) => (
    <TouchableOpacity
      style={styles.clubCard}
      onPress={() => handleClubPress(item.id)}>
      <View style={styles.clubLogo}>
        <Icon name="groups" size={40} color="#0066cc" />
      </View>
      <View style={styles.clubInfo}>
        <Text style={styles.clubName}>{item.name}</Text>
        <Text style={styles.clubType}>
          {t(`clubs.${item.type}` as any)}
        </Text>
        <Text style={styles.clubDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('clubs.title')}</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('clubs.searchPlaceholder')}
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              selectedFilter === filter.id && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter.id)}>
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.id && styles.filterTextActive,
              ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Clubs List */}
      <FlatList
        data={filteredClubs}
        keyExtractor={item => item.id}
        renderItem={renderClub}
        contentContainerStyle={styles.clubsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="search-off" size={64} color="#ccc" />
            <Text style={styles.emptyText}>{t('clubs.noClubs')}</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0066cc',
    padding: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#0066cc',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  clubsList: {
    padding: 16,
  },
  clubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  clubLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e6f3ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  clubInfo: {
    flex: 1,
  },
  clubName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  clubType: {
    fontSize: 12,
    color: '#0066cc',
    marginBottom: 4,
    fontWeight: '500',
  },
  clubDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});

export default ClubDirectoryScreen;
