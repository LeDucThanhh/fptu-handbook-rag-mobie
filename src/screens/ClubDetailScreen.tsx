import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RootStackParamList} from '../navigation/AppNavigator';

type ClubDetailRouteProp = RouteProp<RootStackParamList, 'ClubDetail'>;

const ClubDetailScreen = () => {
  const route = useRoute<ClubDetailRouteProp>();
  const {clubId} = route.params;
  const {t} = useTranslation();

  // Mock club detail data
  const clubDetail = {
    id: clubId,
    name: 'CLB Lập trình',
    description: 'Câu lạc bộ dành cho sinh viên yêu thích lập trình và công nghệ thông tin. Chúng tôi tổ chức các hoạt động học tập, chia sẻ kiến thức và cơ hội phát triển kỹ năng lập trình.',
    logo: undefined,
    coverImage: undefined,
    management: [
      {position: 'Chủ nhiệm', name: 'Nguyễn Văn A', term: '2024-2025'},
      {position: 'Phó Chủ nhiệm', name: 'Trần Thị B', term: '2024-2025'},
    ],
    contact: {
      email: 'clb-laptrinh@fpt.edu.vn',
      fanpage: 'https://facebook.com/clb-laptrinh',
      phone: '0123456789',
    },
    events: [
      {
        id: '1',
        title: 'Workshop React Native',
        date: '15/12/2024',
        location: 'Phòng A101',
      },
      {
        id: '2',
        title: 'Cuộc thi Hackathon',
        date: '20/12/2024',
        location: 'Sảnh chính',
      },
    ],
  };

  const handleContact = async (type: 'email' | 'fanpage', value: string) => {
    try {
      if (type === 'email') {
        await Linking.openURL(`mailto:${value}`);
      } else if (type === 'fanpage') {
        await Linking.openURL(value);
      }
    } catch (error) {
      console.error('Error opening link:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Cover Image Placeholder */}
      <View style={styles.coverImage}>
        <Icon name="groups" size={80} color="#fff" />
      </View>

      {/* Club Info */}
      <View style={styles.content}>
        <View style={styles.clubHeader}>
          <View style={styles.logoContainer}>
            <Icon name="groups" size={48} color="#0066cc" />
          </View>
          <Text style={styles.clubName}>{clubDetail.name}</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.description}>{clubDetail.description}</Text>
        </View>

        {/* Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('clubDetail.management')}</Text>
          {clubDetail.management.map((member, index) => (
            <View key={index} style={styles.managementItem}>
              <Text style={styles.managementPosition}>{member.position}</Text>
              <Text style={styles.managementName}>{member.name}</Text>
              <Text style={styles.managementTerm}>
                Nhiệm kỳ: {member.term}
              </Text>
            </View>
          ))}
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('clubDetail.contact')}</Text>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleContact('email', clubDetail.contact.email)}>
            <Icon name="email" size={24} color="#0066cc" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>{t('clubDetail.email')}</Text>
              <Text style={styles.contactValue}>
                {clubDetail.contact.email}
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() =>
              handleContact('fanpage', clubDetail.contact.fanpage)
            }>
            <Icon name="facebook" size={24} color="#0066cc" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>
                {t('clubDetail.fanpage')}
              </Text>
              <Text style={styles.contactValue}>
                {clubDetail.contact.fanpage}
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('clubDetail.events')}</Text>
          {clubDetail.events.map(event => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventIcon}>
                <Icon name="event" size={24} color="#0066cc" />
              </View>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDetails}>
                  {event.date} • {event.location}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Join Button */}
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>{t('clubDetail.join')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  coverImage: {
    height: 200,
    backgroundColor: '#0066cc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  clubHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e6f3ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  clubName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  managementItem: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  managementPosition: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 4,
  },
  managementName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  managementTerm: {
    fontSize: 14,
    color: '#666',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e6f3ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  eventDetails: {
    fontSize: 14,
    color: '#666',
  },
  joinButton: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ClubDetailScreen;
