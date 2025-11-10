import apiClient from './apiClient';
import { normalizeTokenValue } from '../utils/storage';

export const googleLogin = async ({ idToken, preferredLanguage }) => {
  const response = await apiClient.post('/api/Auth/google-login', {
    idToken,
    preferredLanguage
  });

  return response.data;
};

const extractToken = (payload) => {
  const candidates = [
    payload?.token,
    payload?.accessToken,
    payload?.jwt,
    payload?.data?.token,
    payload?.data?.accessToken,
    payload?.data?.jwt,
    payload?.authentication?.accessToken,
    payload?.authentication?.idToken,
    payload?.token?.accessToken,
    payload?.token?.access_token,
    payload?.data?.token?.accessToken,
    payload?.data?.token?.access_token
  ];

  for (const candidate of candidates) {
    const resolved = normalizeTokenValue(candidate);
    if (resolved) {
      return resolved;
    }
  }

  return null;
};

export const transformAuthPayload = (payload) => {
  const token = extractToken(payload);
  const user = payload?.user ?? payload?.data?.user ?? null;

  if (!token) {
    throw new Error('Authentication payload missing token');
  }

  return { token, user };
};
