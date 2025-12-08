// Environment Configuration
// Update these values based on your development setup
import { Platform } from "react-native";

// Get environment variables from .env file
// For iOS simulator, use localhost. For physical devices, use your machine's IP
const getApiHost = () => {
  // iOS Simulator can use localhost
  if (Platform.OS === "ios") {
    return "localhost";
  }

  // Android Emulator: Use 10.0.2.2 (special alias to host machine)
  // This allows Android to reach Mac's localhost
  if (Platform.OS === "android") {
    return "10.0.2.2";
  }

  // Web/other platforms
  return "localhost";
};

const API_HOST = getApiHost();
const API_PORT = "5000";

export const API_CONFIG = {
  // For development, replace with your machine's IP address
  // Find your IP with: ifconfig (macOS/Linux) or ipconfig (Windows)
  BASE_URL: __DEV__
    ? `http://${API_HOST}:${API_PORT}/api` // Using localhost
    : "https://your-production-api.com/api",

  // Timeout for API requests (in milliseconds)
  TIMEOUT: 10000,

  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};

// Kajabi Configuration
export const KAJABI_CONFIG = {
  // Your Kajabi storefront URL (configurable via .env)
  STOREFRONT_URL:
    process.env.EXPO_PUBLIC_KAJABI_STOREFRONT_URL ||
    "https://niaqi.mykajabi.com",

  // Alternative URLs for different environments
  // PRODUCTION_URL: "https://your-custom-domain.com",
  // STAGING_URL: "https://staging.mykajabi.com",
};

// Stripe Configuration
export const STRIPE_CONFIG = {
  PUBLISHABLE_KEY:
    process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51Sc3o43f4cU2mk6c9EpJ2omzaRPoWDjk6SNikcpSxuZ9TzB7zszomdxsaUcS51ZCS8s8BhKQQpr9UAdOLII6lmNj00JIe16HiH",
  MERCHANT_NAME: "NIAQI",
  RETURN_URL: "niaqi://stripe-redirect",
};

// Instructions for finding your IP address:
//
// macOS/Linux:
//   Run: ifconfig | grep "inet " | grep -v 127.0.0.1
//   Look for something like: inet 192.168.1.100
//
// Windows:
//   Run: ipconfig
//   Look for "IPv4 Address" under your network adapter
//
// For Expo development:
// 1. Make sure your phone and computer are on the same WiFi network
// 2. Update the IP address above
// 3. Restart the Expo development server
//
// For Android emulator:
//   Use: http://10.0.2.2:5000/api
//
// For iOS simulator:
//   Use: http://localhost:5000/api
//
// For physical devices:
//   Use your computer's actual IP address (e.g., http://192.168.1.100:5000/api)

export default API_CONFIG;
