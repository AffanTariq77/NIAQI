import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance } from "axios";
import { API_CONFIG } from "./config";
import { MOCK_API_RESPONSES, USE_MOCK_API } from "./mock-api";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  membershipType: "BASIC" | "PREMIUM" | "PREMIUM_PLUS" | null;
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

export interface MembershipPlan {
  id: string;
  name: string;
  type: "BASIC" | "PREMIUM" | "PREMIUM_PLUS";
  description: string;
  features: string[];
  currentPrice: number;
  oldPrice: number | null;
  durationMonths: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  membershipPlanId: string;
  quantity: number;
  price: number;
  membershipPlan: MembershipPlan;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  membershipPlanId: string;
  quantity: number;
  price: number;
  subtotal: number;
  membershipPlan: {
    id: string;
    name: string;
    type: string;
    description: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED" | "REFUNDED";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string | null;
  transactionId: string | null;
  items: OrderItem[];
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: {
    membershipPlanId: string;
    quantity: number;
    price: number;
  }[];
  paymentMethod?: string;
  billingName?: string;
  billingEmail?: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingCountry?: string;
  billingPostalCode?: string;
  notes?: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  bio: string | null;
  profileImage: string | null;
  institution: string | null;
  fieldOfStudy: string | null;
  graduationYear: number | null;
  interests: string[];
  notifications: boolean;
  createdAt: string;
  updatedAt: string;
}

// Document types (Google Drive sync)
export interface Document {
  id: string;
  driveId: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentsResponse {
  success: boolean;
  count: number;
  data: Document[];
}

export interface SyncResponse {
  success: boolean;
  message: string;
  newFiles: number;
  updatedFiles: number;
  skippedFiles: number;
  totalFiles: number;
}

export interface CreateStudentProfileRequest {
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  bio?: string;
  profileImage?: string;
  institution?: string;
  fieldOfStudy?: string;
  graduationYear?: number;
  interests?: string[];
  notifications?: boolean;
}

export interface UpdateStudentProfileRequest {
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  bio?: string;
  profileImage?: string;
  institution?: string;
  fieldOfStudy?: string;
  graduationYear?: number;
  interests?: string[];
  notifications?: boolean;
}

// API Configuration
const API_BASE_URL = API_CONFIG.BASE_URL;

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
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
        "Content-Type": "application/json",
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

        // Don't retry on auth endpoints or if already retried
        const isAuthEndpoint =
          originalRequest.url?.includes("/auth/signin") ||
          originalRequest.url?.includes("/auth/signup") ||
          originalRequest.url?.includes("/auth/refresh-token");

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !isAuthEndpoint
        ) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => {
                return this.client(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = await AsyncStorage.getItem(
              STORAGE_KEYS.REFRESH_TOKEN
            );
            if (!refreshToken) {
              // No refresh token, clear everything and reject
              await this.clearTokens();
              throw new Error("No refresh token available");
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return MOCK_API_RESPONSES.signUp;
    }
    console.log("🔵 API Client - SignUp Request:");
    console.log("  URL:", `${API_BASE_URL}/auth/signup`);
    console.log("  Data:", JSON.stringify(data, null, 2));
    try {
      const response = await this.client.post<AuthResponse>(
        "/auth/signup",
        data
      );
      console.log("✅ API Client - SignUp Success:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ API Client - SignUp Error:");
      console.error("  Message:", error.message);
      console.error("  Response:", error.response?.data);
      console.error("  Status:", error.response?.status);
      throw error;
    }
  }

  async signIn(data: SignInRequest): Promise<AuthResponse> {
    if (USE_MOCK_API) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return MOCK_API_RESPONSES.signIn;
    }
    const response = await this.client.post<AuthResponse>("/auth/signin", data);
    return response.data;
  }

  async confirmEmail(userId: string, token: string): Promise<void> {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return;
    }
    await this.client.get("/auth/confirm-email", {
      params: { userId, token },
    });
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<string> {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return MOCK_API_RESPONSES.forgotPassword;
    }
    const response = await this.client.post<{ message: string }>(
      "/auth/forgot-password",
      data
    );
    return response.data.message;
  }

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return;
    }
    await this.client.post("/auth/reset-password", data);
  }

  async refreshToken(data: RefreshTokenRequest): Promise<AuthResponse> {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return MOCK_API_RESPONSES.signIn;
    }
    const response = await this.client.post<AuthResponse>(
      "/auth/refresh",
      data
    );
    return response.data;
  }

  async logout(refreshToken: string): Promise<void> {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await this.clearTokens();
      return;
    }
    try {
      await this.client.post("/auth/logout", { refreshToken });
    } finally {
      await this.clearTokens();
    }
  }

  async getCurrentUser(): Promise<User> {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return MOCK_API_RESPONSES.signIn.user;
    }
    const response = await this.client.get<User>("/auth/me");
    return response.data;
  }

  async updateMembership(
    membershipType: "BASIC" | "PREMIUM" | "PREMIUM_PLUS"
  ): Promise<User> {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        ...MOCK_API_RESPONSES.signIn.user,
        membershipType,
      };
    }
    const response = await this.client.patch<User>("/auth/membership", {
      membershipType,
    });
    return response.data;
  }

  // Membership API methods
  async getMembershipPlans(): Promise<MembershipPlan[]> {
    const response = await this.client.get<MembershipPlan[]>(
      "/membership/plans"
    );
    return response.data;
  }

  async getMembershipPlanById(planId: string): Promise<MembershipPlan> {
    const response = await this.client.get<MembershipPlan>(
      `/membership/plans/${planId}`
    );
    return response.data;
  }

  async getMembershipPlanByType(type: string): Promise<MembershipPlan> {
    const response = await this.client.get<MembershipPlan>(
      `/membership/plans/type/${type}`
    );
    return response.data;
  }

  // Cart API methods
  async getCart(): Promise<Cart> {
    const response = await this.client.get<Cart>("/cart");
    return response.data;
  }

  async addToCart(
    membershipPlanId: string,
    quantity: number = 1
  ): Promise<Cart> {
    const response = await this.client.post<Cart>("/cart/add", {
      membershipPlanId,
      quantity,
    });
    return response.data;
  }

  async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    const response = await this.client.patch<Cart>(`/cart/items/${itemId}`, {
      quantity,
    });
    return response.data;
  }

  async removeFromCart(itemId: string): Promise<void> {
    await this.client.delete(`/cart/items/${itemId}`);
  }

  async clearCart(): Promise<void> {
    await this.client.delete("/cart/clear");
  }

  // Order API methods
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await this.client.post<Order>("/orders", orderData);
    return response.data;
  }

  async checkoutFromCart(): Promise<Order> {
    const response = await this.client.post<Order>("/orders/checkout");
    return response.data;
  }

  async getOrders(): Promise<Order[]> {
    const response = await this.client.get<Order[]>("/orders");
    return response.data;
  }

  async getOrderById(orderId: string): Promise<Order> {
    const response = await this.client.get<Order>(`/orders/${orderId}`);
    return response.data;
  }

  // Student Profile API methods
  async getStudentProfile(): Promise<StudentProfile> {
    const response = await this.client.get<StudentProfile>("/student-profile");
    return response.data;
  }

  async createStudentProfile(
    profileData: CreateStudentProfileRequest
  ): Promise<StudentProfile> {
    const response = await this.client.post<StudentProfile>(
      "/student-profile",
      profileData
    );
    return response.data;
  }

  async updateStudentProfile(
    profileData: UpdateStudentProfileRequest
  ): Promise<StudentProfile> {
    const response = await this.client.patch<StudentProfile>(
      "/student-profile",
      profileData
    );
    return response.data;
  }

  async deleteStudentProfile(): Promise<void> {
    await this.client.delete("/student-profile");
  }

  // Documents API methods (Google Drive sync)
  async getDocuments(): Promise<DocumentsResponse> {
    const response = await this.client.get<DocumentsResponse>("/documents");
    return response.data;
  }

  async downloadDocument(documentId: string): Promise<Blob> {
    const response = await this.client.get(`/documents/${documentId}`, {
      responseType: "blob",
    });
    return response.data;
  }

  async triggerDocumentSync(): Promise<SyncResponse> {
    const response = await this.client.get<SyncResponse>("/documents/sync/now");
    return response.data;
  }

  getDocumentDownloadUrl(documentId: string): string {
    return `${this.client.defaults.baseURL}/documents/${documentId}`;
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
