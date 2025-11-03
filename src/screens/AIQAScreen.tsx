import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../theme';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  feedback?: 'liked' | 'disliked' | null;
}

const AIQAScreen = () => {
  const {t, i18n} = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi có thể giúp bạn gì về quy định học vụ, dịch vụ campus, hoặc thông tin câu lạc bộ?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to bottom when new message arrives
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({animated: true});
    }, 100);
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // TODO: Implement RAG API call
    // For now, simulate API response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Đây là câu trả lời mẫu từ hệ thống RAG. Tính năng này sẽ được tích hợp với API RAG thực tế.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleFeedback = (messageId: string, type: 'liked' | 'disliked') => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? {...msg, feedback: type}
          : msg,
      ),
    );
    
    // TODO: Send feedback to API
    Alert.alert(t('common.success'), t('aiqa.feedbackThanks'));
  };

  const renderMessage = ({item}: {item: Message}) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessage : styles.aiMessage,
      ]}>
      {!item.isUser && (
        <View style={styles.aiAvatar}>
          <Icon name="smart-toy" size={20} color="#fff" />
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.aiBubble,
        ]}>
        <Text
          style={[
            styles.messageText,
            item.isUser ? styles.userText : styles.aiText,
          ]}>
          {item.text}
        </Text>
      </View>
      {item.isUser && (
        <View style={styles.userAvatar}>
          <Icon name="person" size={20} color="#0066cc" />
        </View>
      )}
      
      {/* Feedback buttons for AI messages */}
      {!item.isUser && (
        <View style={styles.feedbackContainer}>
          <TouchableOpacity
            style={[
              styles.feedbackButton,
              item.feedback === 'liked' && styles.feedbackButtonActive,
            ]}
            onPress={() => handleFeedback(item.id, 'liked')}>
            <Icon
              name="thumb-up"
              size={16}
              color={item.feedback === 'liked' ? '#0066cc' : '#666'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.feedbackButton,
              item.feedback === 'disliked' && styles.feedbackButtonActive,
            ]}
            onPress={() => handleFeedback(item.id, 'disliked')}>
            <Icon
              name="thumb-down"
              size={16}
              color={item.feedback === 'disliked' ? '#0066cc' : '#666'}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('aiqa.title')}</Text>
        <Text style={styles.headerSubtitle}>
          {i18n.language === 'vi'
            ? 'Hỗ trợ Tiếng Việt và Tiếng Anh'
            : 'Supports Vietnamese and English'}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        ListFooterComponent={
          isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>{t('common.loading')}</Text>
            </View>
          ) : null
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t('aiqa.placeholder')}
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}>
          <Icon name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0066cc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e6f3ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#0066cc',
  },
  aiBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#333',
  },
  feedbackContainer: {
    flexDirection: 'row',
    marginLeft: 8,
    gap: 8,
  },
  feedbackButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  feedbackButtonActive: {
    backgroundColor: '#e6f3ff',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0066cc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.5,
  },
});

export default AIQAScreen;
