import React, { useState, useRef, useMemo } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../../theme';
import DynamicHeader from '../../components/navigation/DynamicHeader';
import { createSurfaceScrollStyles } from '../../theme/layout';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AskAIScreen = () => {
  const theme = useTheme();
  const { colors, spacing, typography, radii } = theme;
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    { id: 1, text: 'Xin chào! Tôi có thể giúp gì cho bạn về FPT Handbook?', isBot: true, timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('vi'); // 'vi' or 'en'
  const flatListRef = useRef(null);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
      timestamp: new Date(),
      feedback: null
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate API call to RAG system
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: language === 'vi' 
          ? 'Đây là câu trả lời mẫu từ hệ thống RAG. Tính năng này sẽ được tích hợp với API RAG thực tế.'
          : 'This is a sample response from the RAG system. This feature will be integrated with the actual RAG API.',
        isBot: true,
        timestamp: new Date(),
        feedback: null
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleFeedback = (messageId, isPositive) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, feedback: isPositive } : msg
      )
    );
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.isBot ? styles.botMessage : styles.userMessage
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          {
            backgroundColor: item.isBot ? colors.surface : colors.primary,
            alignSelf: item.isBot ? 'flex-start' : 'flex-end'
          }
        ]}
      >
        <Text
          style={[
            styles.messageText,
            {
              color: item.isBot ? colors.textPrimary : colors.background,
              fontFamily: typography.body.medium.fontFamily
            }
          ]}
        >
          {item.text}
        </Text>
        {item.isBot && item.feedback === null && (
          <View style={styles.feedbackContainer}>
            <Pressable
              onPress={() => handleFeedback(item.id, true)}
              style={styles.feedbackButton}
            >
              <Text style={styles.feedbackText}>👍</Text>
            </Pressable>
            <Pressable
              onPress={() => handleFeedback(item.id, false)}
              style={styles.feedbackButton}
            >
              <Text style={styles.feedbackText}>👎</Text>
            </Pressable>
          </View>
        )}
        {item.feedback !== null && (
          <Text style={styles.feedbackGiven}>
            {item.feedback ? '👍' : '👎'}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <DynamicHeader title="Hỏi AI" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Language Toggle */}
        <View style={styles.languageToggle}>
          <Pressable
            onPress={() => setLanguage('vi')}
            style={[
              styles.languageButton,
              {
                backgroundColor: language === 'vi' ? colors.primary : colors.surface,
                borderColor: colors.border
              }
            ]}
          >
            <Text
              style={[
                styles.languageText,
                {
                  color: language === 'vi' ? colors.background : colors.textPrimary,
                  fontFamily: typography.body.small.fontFamily
                }
              ]}
            >
              Tiếng Việt
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setLanguage('en')}
            style={[
              styles.languageButton,
              {
                backgroundColor: language === 'en' ? colors.primary : colors.surface,
                borderColor: colors.border
              }
            ]}
          >
            <Text
              style={[
                styles.languageText,
                {
                  color: language === 'en' ? colors.background : colors.textPrimary,
                  fontFamily: typography.body.small.fontFamily
                }
              ]}
            >
              English
            </Text>
          </Pressable>
        </View>

        {/* Input Area */}
        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.textPrimary,
                fontFamily: typography.body.medium.fontFamily
              }
            ]}
            placeholder={language === 'vi' ? 'Nhập câu hỏi của bạn...' : 'Enter your question...'}
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <Pressable
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim() && !isLoading ? colors.primary : colors.border,
                opacity: inputText.trim() && !isLoading ? 1 : 0.5
              }
            ]}
          >
            {isLoading ? (
              <Ionicons name="hourglass-outline" size={24} color={colors.background} />
            ) : (
              <Ionicons name="send" size={24} color={colors.background} />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background
    },
    keyboardView: {
      flex: 1
    },
    messagesList: {
      padding: theme.spacing.md,
      paddingBottom: 100 // Tab bar height + extra space
    },
    messageContainer: {
      marginBottom: theme.spacing.md
    },
    botMessage: {
      alignItems: 'flex-start'
    },
    userMessage: {
      alignItems: 'flex-end'
    },
    messageBubble: {
      maxWidth: '80%',
      padding: theme.spacing.md,
      borderRadius: theme.radii.md,
      marginBottom: theme.spacing.xs
    },
    messageText: {
      fontSize: theme.typography.body.medium.fontSize,
      lineHeight: 22
    },
    feedbackContainer: {
      flexDirection: 'row',
      marginTop: theme.spacing.xs,
      gap: theme.spacing.xs
    },
    feedbackButton: {
      padding: theme.spacing.xs
    },
    feedbackText: {
      fontSize: 18
    },
    feedbackGiven: {
      fontSize: 18,
      marginTop: theme.spacing.xs
    },
    languageToggle: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      gap: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border
    },
    languageButton: {
      flex: 1,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radii.sm,
      borderWidth: 1,
      alignItems: 'center'
    },
    languageText: {
      fontSize: theme.typography.body.small.fontSize
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      padding: theme.spacing.md,
      borderTopWidth: 1,
      gap: theme.spacing.sm
    },
    input: {
      flex: 1,
      maxHeight: 100,
      padding: theme.spacing.sm,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      fontSize: theme.typography.body.medium.fontSize
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: theme.radii.md,
      alignItems: 'center',
      justifyContent: 'center'
    }
  });

export default AskAIScreen;

