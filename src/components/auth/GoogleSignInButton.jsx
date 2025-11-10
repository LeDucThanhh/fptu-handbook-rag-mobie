import React, { useEffect } from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';

import { useTheme } from '../../theme';

WebBrowser.maybeCompleteAuthSession();

const getClientIds = () => {
  const extra = Constants.expoConfig?.extra ?? Constants.manifest?.extra ?? {};
  return {
    expoClientId: extra.googleWebClientId,
    iosClientId: extra.googleIosClientId,
    androidClientId: extra.googleAndroidClientId,
    webClientId: extra.googleWebClientId
  };
};

const GoogleSignInButton = ({ onSuccess, onError, isLoading }) => {
  const { colors, typography, spacing, radii } = useTheme();
  const clientIds = getClientIds();
  const redirectUri = makeRedirectUri({
    useProxy: true,
    scheme: Constants.expoConfig?.scheme
  });

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      ...clientIds,
      redirectUri,
      responseType: 'id_token',
      scopes: ['openid', 'profile', 'email'],
      selectAccount: true
    },
    { useProxy: true }
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken || response.params?.id_token;
      if (idToken) {
        onSuccess?.(idToken);
      } else {
        onError?.(new Error('Google login did not return an ID token.'));
      }
    } else if (response?.type === 'error') {
      const error = response.error || new Error('Google login failed.');
      onError?.(error);
    }
  }, [response, onSuccess, onError]);

  const handlePress = async () => {
    try {
      await promptAsync({ useProxy: true });
    } catch (error) {
      onError?.(error);
    }
  };

  const disabled = isLoading || !request;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => ({
        backgroundColor: disabled ? colors.surfaceAlt : pressed ? colors.primaryDark : colors.primary,
        paddingVertical: spacing.md,
        borderRadius: radii.md,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        opacity: disabled ? 0.7 : 1
      })}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.background} />
      ) : (
        <>
          <Text
            style={{
              color: colors.background,
              fontFamily: typography.button.fontFamily,
              fontSize: typography.button.fontSize
            }}
          >
            Sign in with Google
          </Text>
        </>
      )}
    </Pressable>
  );
};

export default GoogleSignInButton;

