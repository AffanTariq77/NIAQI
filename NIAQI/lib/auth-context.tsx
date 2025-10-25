import { apiClient, AuthResponse, clearStoredUser, ForgotPasswordRequest, getStoredUser, ResetPasswordRequest, setStoredUser, SignInRequest, SignUpRequest, User } from '@/lib/api-client';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (data: SignUpRequest) => Promise<AuthResponse>;
  signIn: (data: SignInRequest) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<string>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  confirmEmail: (userId: string, token: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      // Check if we have stored tokens
      const { accessToken, refreshToken } = await apiClient.getStoredTokens();
      
      if (accessToken && refreshToken) {
        // Try to get current user to validate token
        try {
          const currentUser = await apiClient.getCurrentUser();
          setUser(currentUser);
          await setStoredUser(currentUser);
        } catch (error) {
          // Token might be expired, try to refresh
          try {
            const authResponse = await apiClient.refreshToken({ refreshToken });
            await apiClient.setTokens(authResponse.accessToken, authResponse.refreshToken);
            await setStoredUser(authResponse.user);
            setUser(authResponse.user);
          } catch (refreshError) {
            // Refresh failed, clear tokens
            await apiClient.clearTokens();
            await clearStoredUser();
            setUser(null);
          }
        }
      } else {
        // No tokens, check if we have stored user data
        const storedUser = await getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      await apiClient.clearTokens();
      await clearStoredUser();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.signUp(data);
      await apiClient.setTokens(response.accessToken, response.refreshToken);
      await setStoredUser(response.user);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (data: SignInRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.signIn(data);
      await apiClient.setTokens(response.accessToken, response.refreshToken);
      await setStoredUser(response.user);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { refreshToken } = await apiClient.getStoredTokens();
      if (refreshToken) {
        await apiClient.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await apiClient.clearTokens();
      await clearStoredUser();
      setUser(null);
    }
  };

  const forgotPassword = async (data: ForgotPasswordRequest): Promise<string> => {
    try {
      return await apiClient.forgotPassword(data);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
    try {
      await apiClient.resetPassword(data);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const confirmEmail = async (userId: string, token: string): Promise<void> => {
    try {
      await apiClient.confirmEmail(userId, token);
    } catch (error) {
      console.error('Confirm email error:', error);
      throw error;
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      if (isAuthenticated) {
        const currentUser = await apiClient.getCurrentUser();
        setUser(currentUser);
        await setStoredUser(currentUser);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      // If refresh fails, user might be logged out
      await signOut();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    forgotPassword,
    resetPassword,
    confirmEmail,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
