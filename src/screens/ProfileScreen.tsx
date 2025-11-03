import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import {useAuth} from '../contexts/AuthContext';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const {user, logout} = useAuth();
  const {t, i18n} = useTranslation();
  const [isVietnamese, setIsVietnamese] = useState(i18n.language === 'vi');

  const handleLanguageChange = async (value: boolean) => {
    setIsVietnamese(value);
    const newLanguage = value ? 'vi' : 'en';
    await i18n.changeLanguage(newLanguage);
    await AsyncStorage.setItem('language', newLanguage);
  };

  const handleLogout = () => {
    Alert.alert(
      t('common.logout'),
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {text: t('common.cancel'), style: 'cancel'},
        {
          text: t('common.logout'),
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ],
    );
  };

  const menuItems = [
    {
      id: 'language',
      icon: 'language',
      title: t('profile.language'),
      rightComponent: (
        <View style={styles.languageSwitch}>
          <Text
            style={[
              styles.languageOption,
              isVietnamese && styles.languageOptionActive,
            ]}>
            {t('profile.vietnamese')}
          </Text>
          <Switch
            value={!isVietnamese}
            onValueChange={value => handleLanguageChange(!value)}
            trackColor={{false: '#ccc', true: '#0066cc'}}
            thumbColor="#fff"
          />
          <Text
            style={[
              styles.languageOption,
              !isVietnamese && styles.languageOptionActive,
            ]}>
            {t('profile.english')}
          </Text>
        </View>
      ),
    },
    {
      id: 'help',
      icon: 'help',
      title: t('profile.help'),
      onPress: () => Alert.alert(t('profile.help'), 'Tính năng đang phát triển'),
    },
    {
      id: 'report',
      icon: 'bug-report',
      title: t('profile.reportBug'),
      onPress: () => Alert.alert(t('profile.reportBug'), 'Tính năng đang phát triển'),
    },
    {
      id: 'about',
      icon: 'info',
      title: t('profile.about'),
      onPress: () =>
        Alert.alert(
          t('profile.about'),
          'FPTU Handbook RAG Mobile\nVersion 1.0.0',
        ),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile.title')}</Text>
      </View>

      {/* User Info */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Icon name="person" size={60} color="#0066cc" />
        </View>
        <Text style={styles.userName}>{user?.name || 'Sinh viên'}</Text>
        <View style={styles.userInfo}>
          <View style={styles.infoRow}>
            <Icon name="badge" size={20} color="#666" />
            <Text style={styles.infoText}>
              {t('profile.studentId')}: {user?.studentId || 'N/A'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="email" size={20} color="#666" />
            <Text style={styles.infoText}>{user?.email || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
            disabled={!item.onPress}>
            <Icon name={item.icon} size={24} color="#0066cc" />
            <Text style={styles.menuItemText}>{item.title}</Text>
            <View style={styles.menuItemRight}>
              {item.rightComponent || (
                <Icon name="chevron-right" size={24} color="#999" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={24} color="#fff" />
        <Text style={styles.logoutButtonText}>{t('common.logout')}</Text>
      </TouchableOpacity>
    </ScrollView>
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
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
    marginBottom: 16,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e6f3ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  userInfo: {
    width: '100%',
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
  },
  settingsSection: {
    backgroundColor: '#fff',
    marginBottom: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 16,
    paddingBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
  menuItemRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageOption: {
    fontSize: 14,
    color: '#666',
  },
  languageOptionActive: {
    color: '#0066cc',
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4444',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    gap: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
