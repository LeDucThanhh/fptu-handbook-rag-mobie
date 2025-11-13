import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, TextInput } from 'react-native';
import { useTheme } from '../../theme';
import useAuth from '../../hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
  const { colors, typography, spacing, radii } = useTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Google OAuth
      // For now, mock login
      const mockEmail = email || 'student@fpt.edu.vn';

      if (!mockEmail.endsWith('@fpt.edu.vn')) {
        Alert.alert('Lỗi', 'Vui lòng sử dụng email sinh viên FPT (@fpt.edu.vn)');
        setIsLoading(false);
        return;
      }

      // Simulate API call to Academic Office
      await new Promise(resolve => setTimeout(resolve, 1000));

      signIn({
        token: 'local-dev-token',
        user: {
          id: 'local-user',
          displayName: 'FPTU Student',
          email: mockEmail,
          studentId: 'SE123456'
        }
      });
    } catch (error) {
      Alert.alert('Lỗi', 'Đăng nhập thất bại. Vui lòng thử lại.');
      setIsLoading(false);
    }
  }, [signIn, email]);

  return (
    <View style={styles.container}>
      <View style={[styles.content, { padding: spacing.xl }]}>
        <View style={styles.logoContainer}>
          <Ionicons name="school" size={64} color={colors.primary} />
        </View>

        <Text
          style={{
            fontSize: typography.heading.h1.fontSize,
            color: colors.textPrimary,
            marginBottom: spacing.sm,
            fontFamily: typography.heading.h1.fontFamily,
            textAlign: 'center'
          }}
        >
          FPT Handbook
        </Text>
        <Text
          style={{
            fontSize: typography.body.medium.fontSize,
            color: colors.textSecondary,
            marginBottom: spacing.xxl,
            fontFamily: typography.body.medium.fontFamily,
            textAlign: 'center'
          }}
        >
          Đăng nhập để truy cập thông tin và dịch vụ
        </Text>

        <View style={[styles.inputContainer, { marginBottom: spacing.lg }]}>
          <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={{ marginRight: spacing.sm }} />
          <TextInput
            placeholder="Email sinh viên (@fpt.edu.vn)"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              flex: 1,
              fontSize: typography.body.medium.fontSize,
              fontFamily: typography.body.medium.fontFamily,
              color: colors.textPrimary
            }}
          />
        </View>

        <Pressable
          onPress={handleGoogleLogin}
          disabled={isLoading}
          style={({ pressed }) => [
            styles.googleButton,
            {
              backgroundColor: pressed ? colors.primaryDark : colors.primary,
              opacity: isLoading ? 0.7 : 1
            }
          ]}
        >
          <Ionicons name="logo-google" size={24} color={colors.background} style={{ marginRight: spacing.sm }} />
          <Text
            style={{
              fontFamily: typography.button.fontFamily,
              fontSize: typography.button.fontSize,
              color: colors.background
            }}
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập bằng Google'}
          </Text>
        </Pressable>

        <Text
          style={{
            fontSize: typography.caption.fontSize,
            color: colors.textMuted,
            marginTop: spacing.lg,
            textAlign: 'center',
            fontFamily: typography.caption.fontFamily
          }}
        >
          Chỉ dành cho sinh viên FPT với email @fpt.edu.vn
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center'
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F7FA'
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  }
});

export default LoginScreen;

