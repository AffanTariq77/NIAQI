import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from './config';
import { MOCK_API_RESPONSES, USE_MOCK_API } from './mock-api';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isEmailConfirmed: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  userId: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ConfirmEmailRequest {
  userId: string;
  token: string;
}

// API Configuration
const API_BASE_URL = API_CONFIG.BASE_URL;

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
} as const;

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.client(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await this.refreshToken({ refreshToken });
            await this.setTokens(response.accessToken, response.refreshToken);

            // Process failed queue
            this.processQueue(null);

            // Retry original request
            return this.client(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError);
            await this.clearTokens();
            throw refreshError;
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
    this.failedQueue = [];
  }

  // Token management
  async setTokens(accessToken: string, refreshToken: string) {
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }

  async clearTokens() {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER,
    ]);
  }

  async getStoredTokens() {
    const [accessToken, refreshToken] = await AsyncStorage.multiGet([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
    ]);
    return {
      accessToken: accessToken[1],
      refreshToken: refreshToken[1],
    };
  }

  // Auth API methods
  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    if (USE_MOCK_API) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return MOCK_API_RESPONSES.signUp;
    }
    const response = await this.client.post<AuthResponse>('/auth/signup', data);
    return response.data;
  }

  async signIn(data: SignInRequest): Promise<AuthResponse> {
    if (USE_MOCK_API) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return MOCK_API_RESPONSES.signIn;
    }
    const response = await this.client.post<AuthResponse>('/auth/signin', data);
    return response.data;
  }

  async confirmEmail(userId: string, token: string): Promise<void> {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }
    await this.client.get('/auth/confirm-email', {
      params: { userId, token },
    });
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<string> {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return MOCK_API_RESPONSES.forgotPassword;
    }
    const response = await this.client.post<{ message: string }>('/auth/forgot-password', data);
    return response.data.message;
  }

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }
    await this.client.post('/auth/reset-password', data);
  }

  async refreshToken(data: RefreshTokenRequest): Promise<AuthResponse> {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_API_RESPONSES.signIn;
    }
    const response = await this.client.post<AuthResponse>('/auth/refresh', data);
    return response.data;
  }

  async logout(refreshToken: string): Promise<void> {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      await this.clearTokens();
      return;
    }
    try {
      await this.client.post('/auth/logout', { refreshToken });
    } finally {
      await this.clearTokens();
    }
  }

  async getCurrentUser(): Promise<User> {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_API_RESPONSES.signIn.user;
    }
    const response = await this.client.get<User>('/users/me');
    return response.data;
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Helper functions for token management
export const getStoredUser = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return userJson ? JSON.parse(userJson) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = async (user: User): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const clearStoredUser = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEYS.USER);
};
