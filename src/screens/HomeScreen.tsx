import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {WingBlank, WhiteSpace} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import {CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RootStackParamList, MainTabParamList} from '../navigation/AppNavigator';
import {COLORS, FONTS} from '../theme';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {t} = useTranslation();

  // Mock notifications data
  const recentNotifications = [
    {
      id: '1',
      title: 'Thông báo lịch học mới',
      message: 'Lịch học kỳ mới đã được cập nhật',
      time: '2 giờ trước',
      category: 'academic',
    },
    {
      id: '2',
      title: 'Sự kiện ngày hội CLB',
      message: 'Ngày hội câu lạc bộ sẽ diễn ra vào cuối tuần này',
      time: '5 giờ trước',
      category: 'events',
    },
  ];

  const shortcuts = [
    {
      id: '1',
      title: t('home.clubDirectory'),
      icon: 'groups',
      screen: 'Clubs' as const,
      color: '#0066cc',
    },
    {
      id: '2',
      title: t('home.collections'),
      icon: 'collections',
      screen: 'AIQA' as const,
      color: '#00a8e8',
    },
  ];

  const handleAskAI = () => {
    // Navigate to AI QA screen in tab navigator
    (navigation as any).getParent()?.navigate('AIQA');
  };

  const handleShortcut = (screen: 'Clubs' | 'AIQA') => {
    // Navigate within tab navigator
    (navigation as any).getParent()?.navigate(screen);
  };

  return (
    <ScrollView style={styles.container}>
      <WingBlank size="lg">
        <WhiteSpace size="lg" />
        {/* AI Q&A Bar */}
        <TouchableOpacity style={styles.aiBar} onPress={handleAskAI}>
          <Icon name="smart-toy" size={28} color={COLORS.white} />
          <View style={styles.aiBarContent}>
            <Text style={styles.aiBarTitle}>{t('home.askAI')}</Text>
            <Text style={styles.aiBarPlaceholder}>
              {t('home.askAIPlaceholder')}
            </Text>
          </View>
          <Icon name="arrow-forward" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <WhiteSpace size="lg" />
      </WingBlank>

      {/* Recent Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('home.recentNotifications')}
        </Text>
        <FlatList
          data={recentNotifications}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.notificationCard}>
              <View style={styles.notificationIcon}>
                <Icon
                  name={
                    item.category === 'academic' ? 'school' : 'event'
                  }
                  size={24}
                  color={COLORS.primary}
                />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationTime}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Shortcuts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('home.shortcuts')}</Text>
        <View style={styles.shortcutsContainer}>
          {shortcuts.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.shortcutCard, {borderLeftColor: item.color}]}
              onPress={() => handleShortcut(item.screen)}>
              <Icon name={item.icon} size={32} color={item.color} />
              <Text style={styles.shortcutTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  aiBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aiBarContent: {
    flex: 1,
    marginLeft: 12,
  },
  aiBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: 4,
  },
  aiBarPlaceholder: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  shortcutsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  shortcutCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  shortcutTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginTop: 12,
    textAlign: 'center',
  },
});

export default HomeScreen;
