// Environment Configuration
// Update these values based on your development setup

export const API_CONFIG = {
  // For development, replace with your machine's IP address
  // Find your IP with: ifconfig (macOS/Linux) or ipconfig (Windows)
  BASE_URL: __DEV__
    ? "http://10.162.133.229:5000/api" // Your Mac's actual WiFi IP (en0)
    : "https://your-production-api.com/api",

  // Timeout for API requests (in milliseconds)
  TIMEOUT: 10000,

  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
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
