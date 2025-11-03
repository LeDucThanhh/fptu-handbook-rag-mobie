import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Notification {
  id: string;
  title: string;
  message: string;
  category: 'academic' | 'events' | 'clubs' | 'all';
  timestamp: Date;
  read: boolean;
}

const NotificationsScreen = () => {
  const {t} = useTranslation();
  const [selectedTab, setSelectedTab] = useState<string>('all');

  // Mock notifications data
  const allNotifications: Notification[] = [
    {
      id: '1',
      title: 'Thông báo lịch học mới',
      message: 'Lịch học kỳ mới đã được cập nhật. Vui lòng kiểm tra lịch học của bạn.',
      category: 'academic',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: '2',
      title: 'Sự kiện ngày hội CLB',
      message: 'Ngày hội câu lạc bộ sẽ diễn ra vào cuối tuần này tại sân trường.',
      category: 'events',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: '3',
      title: 'CLB Lập trình tuyển thành viên',
      message: 'CLB Lập trình đang tuyển thành viên mới. Đăng ký ngay!',
      category: 'clubs',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: '4',
      title: 'Thông báo quy định mới',
      message: 'Quy định học tập mới đã được cập nhật. Vui lòng đọc kỹ.',
      category: 'academic',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
    },
  ];

  const tabs = [
    {id: 'all', label: t('notifications.all')},
    {id: 'academic', label: t('notifications.academic')},
    {id: 'events', label: t('notifications.events')},
    {id: 'clubs', label: t('notifications.clubs')},
  ];

  const filteredNotifications = allNotifications.filter(
    notification =>
      selectedTab === 'all' || notification.category === selectedTab,
  );

  const getIcon = (category: string) => {
    switch (category) {
      case 'academic':
        return 'school';
      case 'events':
        return 'event';
      case 'clubs':
        return 'groups';
      default:
        return 'notifications';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} ngày trước`;
    } else if (hours > 0) {
      return `${hours} giờ trước`;
    } else {
      return 'Vừa xong';
    }
  };

  const renderNotification = ({item}: {item: Notification}) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.read && styles.notificationUnread,
      ]}>
      <View
        style={[
          styles.notificationIcon,
          {backgroundColor: item.read ? '#f0f0f0' : '#e6f3ff'},
        ]}>
        <Icon
          name={getIcon(item.category)}
          size={24}
          color={item.read ? '#666' : '#0066cc'}
        />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.notificationTime}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('notifications.title')}</Text>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              selectedTab === tab.id && styles.tabButtonActive,
            ]}
            onPress={() => setSelectedTab(tab.id)}>
            <Text
              style={[
                styles.tabText,
                selectedTab === tab.id && styles.tabTextActive,
              ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={item => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.notificationsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="notifications-none" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {t('notifications.noNotifications')}
            </Text>
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
  tabsContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  tabButtonActive: {
    backgroundColor: '#0066cc',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
  },
  notificationsList: {
    padding: 16,
  },
  notificationCard: {
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
  notificationUnread: {
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0066cc',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
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

export default NotificationsScreen;
