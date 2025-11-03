import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import {Button, WhiteSpace, WingBlank} from '@ant-design/react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useAuth} from '../contexts/AuthContext';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLORS, FONTS} from '../theme';

const LoginScreen = () => {
  const {login} = useAuth();
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      // Check if Google Play Services are available
      await GoogleSignin.hasPlayServices();
      
      // Get user info from Google
      const userInfo = await GoogleSignin.signIn();
      
      if (!userInfo.user?.email) {
        Alert.alert(t('common.error'), t('login.invalidEmail'));
        return;
      }

      // Check if email is valid student email
      const isValid = await login(userInfo.user.email);
      
      if (!isValid) {
        Alert.alert(t('common.error'), t('login.invalidEmail'));
      } else {
        Alert.alert(t('common.success'), t('login.loginSuccess'));
      }
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      if (error.code === 'SIGN_IN_CANCELLED') {
        // User cancelled the login flow
        return;
      }
      Alert.alert(t('common.error'), error.message || t('login.invalidEmail'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setIsLoading(true);
      // Login với email demo
      const demoEmail = 'student@fpt.edu.vn';
      const isValid = await login(demoEmail);
      
      if (isValid) {
        Alert.alert(
          'Demo Mode',
          'Đăng nhập demo thành công!\nEmail: student@fpt.edu.vn',
        );
      } else {
        Alert.alert(t('common.error'), 'Lỗi đăng nhập demo');
      }
    } catch (error) {
      console.error('Demo login error:', error);
      Alert.alert(t('common.error'), 'Lỗi đăng nhập demo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Icon name="school" size={80} color={COLORS.primary} />
          <View style={styles.textContainer}>
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>FPTU Handbook</Text>
            </View>
            <Text style={styles.subtitle}>
              Tra cứu thông tin sinh viên
            </Text>
          </View>
        </View>

        <WingBlank style={styles.loginContainer}>
          <Button
            type="primary"
            loading={isLoading}
            onPress={handleGoogleSignIn}
            style={styles.googleButton}
            activeStyle={styles.googleButtonActive}>
            <Icon name="person" size={20} color={COLORS.white} />
            <WhiteSpace size="sm" />
            {t('login.googleLogin')}
          </Button>
          <WhiteSpace size="lg" />
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>HOẶC</Text>
            <View style={styles.dividerLine} />
          </View>
          <WhiteSpace size="lg" />
          <Button
            type="ghost"
            loading={isLoading}
            onPress={handleDemoLogin}
            style={styles.demoButton}
            activeStyle={styles.demoButtonActive}>
            <Icon name="account-circle" size={20} color={COLORS.primary} />
            <WhiteSpace size="sm" />
            Đăng nhập Demo (Sinh viên)
          </Button>
          <WhiteSpace />
          <Text style={styles.note}>
            Vui lòng đăng nhập bằng email @fpt.edu.vn
          </Text>
          <Text style={styles.demoNote}>
            💡 Dùng chế độ Demo để test ứng dụng không cần Google OAuth
          </Text>
        </WingBlank>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  loginContainer: {
    width: '100%',
    maxWidth: 400,
  },
  googleButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    borderRadius: 8,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonActive: {
    backgroundColor: COLORS.primaryDark,
  },
  note: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginHorizontal: 16,
  },
  demoButton: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoButtonActive: {
    backgroundColor: COLORS.backgroundSecondary,
  },
  demoNote: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default LoginScreen;
