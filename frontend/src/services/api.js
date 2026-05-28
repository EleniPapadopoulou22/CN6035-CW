import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const PORT = 3000;

function getBaseUrl() {
  if (Platform.OS === 'web') {
    return `http://localhost:${PORT}`;
  }

  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.hostUri ||
    Constants.manifest?.debuggerHost;

  if (hostUri) {
    const hostname = hostUri.split(':')[0];

    if (Platform.OS === 'android' && (hostname === 'localhost' || hostname === '127.0.0.1')) {
      return `http://10.0.2.2:${PORT}`;
    }

    return `http://${hostname}:${PORT}`;
  }

  return Platform.OS === 'android'
    ? `http://10.0.2.2:${PORT}`
    : `http://localhost:${PORT}`;
}

const BASE_URL = getBaseUrl();

export const tokenStorage = {
  async get(key) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }

    return SecureStore.getItemAsync(key);
  },

  async set(key, value) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }

    await SecureStore.setItemAsync(key, value);
  },

  async remove(key) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }

    await SecureStore.deleteItemAsync(key);
  },
};

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await tokenStorage.get('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = await tokenStorage.get('refreshToken');

        if (!refreshToken) {
          throw new Error('Missing refresh token');
        }

        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        await tokenStorage.set('accessToken', accessToken);
        await tokenStorage.set('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        await tokenStorage.remove('accessToken');
        await tokenStorage.remove('refreshToken');
        await tokenStorage.remove('user');

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
};

export const theatreApi = {
  getAll: () => api.get('/theatres'),
  search: (search) => api.get(`/theatres?search=${encodeURIComponent(search)}`),
};

export const showApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.theatreId) params.append('theatreId', filters.theatreId);
    if (filters.title) params.append('title', filters.title);

    const query = params.toString();
    return api.get(`/shows${query ? `?${query}` : ''}`);
  },
};

export const showtimeApi = {
  getByShow: (showId) => api.get(`/showtimes?showId=${showId}`),
};

export const seatApi = {
  getByShowtime: (showtimeId) => api.get(`/seats?showtimeId=${showtimeId}`),
};

export const reservationApi = {
  create: (seatId) => api.post('/reservations', { seatId }),
  delete: (reservationId) => api.delete(`/reservations/${reservationId}`),
  getMine: () => api.get('/user/reservations'),
};

export default api;