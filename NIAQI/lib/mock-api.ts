// Mock API responses for testing when backend is not available
export const MOCK_API_RESPONSES = {
  signUp: {
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token", 
    expiresIn: 900,
    user: {
      id: "mock-user-id",
      name: "Test User",
      email: "test@example.com",
      role: "student",
      isEmailConfirmed: false,
      createdAt: new Date().toISOString()
    }
  },
  signIn: {
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
    expiresIn: 900,
    user: {
      id: "mock-user-id", 
      name: "Test User",
      email: "test@example.com",
      role: "student",
      isEmailConfirmed: true,
      createdAt: new Date().toISOString()
    }
  },
  forgotPassword: "Password reset token: mock-reset-token-12345 (Valid for 1 hour)",
  resetPassword: "Password reset successfully",
  confirmEmail: "Email confirmed successfully"
};

// Enable mock mode when backend is not available
export const USE_MOCK_API = true; // Set to false when backend is running
