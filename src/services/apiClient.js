import axios from 'axios';
import Constants from 'expo-constants';

const expoExtra = Constants.expoConfig?.extra ?? Constants.manifest?.extra ?? {};
const baseURL = expoExtra.apiBaseUrl ?? 'https://api.example.com';

let authToken = null;
let unauthorizedHandler = null;

export const setAuthToken = (token) => {
  authToken = token;
};

export const registerUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

const apiClient = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  async (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    if (status === 401 && typeof unauthorizedHandler === 'function') {
      try {
        await unauthorizedHandler();
      } catch (handlerError) {
        console.warn('Unauthorized handler failed', handlerError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

