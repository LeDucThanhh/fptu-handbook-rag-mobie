import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'fptuhandbook.token';
const USER_KEY = 'fptuhandbook.user';

export const normalizeTokenValue = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return value.toString();
  }

  if (typeof value === 'object') {
    const candidateKeys = [
      'accessToken',
      'access_token',
      'token',
      'value',
      'idToken',
      'id_token',
      'jwt'
    ];

    for (const key of candidateKeys) {
      if (key in value) {
        const resolved = normalizeTokenValue(value[key]);
        if (resolved) {
          return resolved;
        }
      }
    }

    return null;
  }

  return String(value);
};

const parseJson = (value, defaultValue = null) => {
  if (!value) {
    return defaultValue;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn('Failed to parse stored value', error);
    return defaultValue;
  }
};

export const saveCredentials = async ({ token, user }) => {
  const operations = [];

  const normalizedToken = normalizeTokenValue(token);

  if (normalizedToken !== null) {
    operations.push(SecureStore.setItemAsync(TOKEN_KEY, normalizedToken));
  } else {
    operations.push(SecureStore.deleteItemAsync(TOKEN_KEY));
  }

  operations.push(
    user
      ? SecureStore.setItemAsync(USER_KEY, JSON.stringify(user))
      : SecureStore.deleteItemAsync(USER_KEY)
  );

  await Promise.all(operations);
};

export const loadCredentials = async () => {
  const [token, rawUser] = await Promise.all([
    SecureStore.getItemAsync(TOKEN_KEY),
    SecureStore.getItemAsync(USER_KEY)
  ]);

  return {
    token: normalizeTokenValue(token),
    user: parseJson(rawUser)
  };
};

export const clearCredentials = async () => {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_KEY)
  ]);
};
