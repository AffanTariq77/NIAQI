# NIAQI - National Indoor Air Quality Institute

A comprehensive mobile application for Indoor Air Quality education and certification. Built with React Native, Expo, and TypeScript.

## 📱 Overview

NIAQI is a mobile application designed to provide comprehensive mold courses and certifications. The app offers:

- **User Authentication**: Sign up, login, password reset functionality
- **Onboarding Experience**: Interactive introduction to the app
- **Course Management**: Access to comprehensive IAQ-related courses
- **Certification Programs**: State-approved certifications (currently in Florida)
- **Cross-platform Support**: iOS, Android, and Web

## 🛠️ Tech Stack

### Frontend

- **Expo** (~54.0.19) - React Native framework
- **React** (19.1.0) - UI library
- **React Native** (0.81.5) - Mobile framework
- **Expo Router** (~6.0.13) - File-based routing
- **TypeScript** (~5.9.2) - Type safety
- **React Navigation** - Navigation library
- **React Native Reanimated** - Animation library
- **React Native Gesture Handler** - Gesture handling
- **React Native Toast Message** - Toast notifications
- **AsyncStorage** - Local storage

### Backend & API

- **Axios** - HTTP client
- **Mock API** support for development
- Configurable API endpoints

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Expo CLI** (installed globally: `npm install -g expo-cli`)
- **Expo Go App** (for testing on physical devices)
  - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
  - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

### For iOS Development (macOS only)

- **Xcode** (latest version)
- **CocoaPods**: `sudo gem install cocoapods`

### For Android Development

- **Android Studio** (latest version)
- **Android SDK** (API level 34+)
- **JDK 17+**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd NIAQI
```

### 2. Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will install all dependencies listed in `package.json`, including:

- React Native core libraries
- Expo packages
- Navigation libraries
- UI components
- API client libraries

### 3. Configure API Settings (Optional)

If you have a backend server, configure the API endpoint in `lib/config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? "http://YOUR_IP_ADDRESS:5000/api"
    : "https://your-production-api.com/api",
  TIMEOUT: 10000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};
```

**Finding Your IP Address:**

- **macOS/Linux**: Run `ifconfig | grep "inet " | grep -v 127.0.0.1`
- **Windows**: Run `ipconfig` and look for "IPv4 Address"
- **Android Emulator**: Use `http://10.0.2.2:5000/api`
- **iOS Simulator**: Use `http://localhost:5000/api`

### 4. Enable/Disable Mock API

The app includes a mock API for development when the backend is not available:

```typescript
// In lib/mock-api.ts
export const USE_MOCK_API = true; // Set to false when backend is running
```

### 5. Start the Development Server

Start the Expo development server:

```bash
npm start
# or
npx expo start
```

You'll see a QR code in your terminal and browser.

## 📱 Running the App

### Option 1: Physical Device (Recommended for Testing)

1. Install **Expo Go** from the App Store or Google Play
2. Scan the QR code displayed in your terminal or browser
3. The app will load on your device

### Option 2: iOS Simulator (macOS only)

1. Press `i` in the terminal where Expo is running
2. Or run: `npm run ios`

### Option 3: Android Emulator

1. Start your Android emulator
2. Press `a` in the terminal where Expo is running
3. Or run: `npm run android`

### Option 4: Web Browser

```bash
npm run web
# or press 'w' in the terminal
```

## 🏗️ Project Structure

```
NIAQI/
├── app/                      # Main application directory
│   ├── _layout.tsx          # Root layout with navigation
│   ├── index.tsx            # Home/landing screen
│   ├── login.tsx            # Login screen
│   ├── onboarding.tsx       # Onboarding flow
│   ├── modal.tsx            # Modal screen
│   └── (tabs)/              # Tab navigation screens
│       ├── _layout.tsx      # Tab layout
│       ├── index.tsx        # Home tab
│       └── explore.tsx      # Explore tab
├── assets/                   # Images and static assets
│   ├── images/              # App icons and images
│   └── logo.png             # App logo
├── components/               # Reusable components
│   ├── onboarding-screen.tsx  # Onboarding component
│   ├── themed-text.tsx      # Themed text component
│   ├── themed-view.tsx      # Themed view component
│   └── ui/                  # UI components
├── constants/               # App constants
│   └── theme.ts             # Theme configuration
├── hooks/                   # Custom React hooks
│   ├── use-color-scheme.ts  # Color scheme hook
│   └── use-theme-color.ts   # Theme color hook
├── lib/                     # Core libraries
│   ├── api-client.ts        # API client with axios
│   ├── auth-context.tsx     # Authentication context
│   ├── config.ts            # API configuration
│   └── mock-api.ts          # Mock API responses
├── prisma/                  # Database migrations
├── scripts/                 # Utility scripts
│   └── reset-project.js     # Reset project script
└── server/                  # Backend server (if available)
```

## 🔧 Available Scripts

```bash
# Start development server
npm start

# Run on specific platform
npm run ios          # iOS simulator
npm run android      # Android emulator
npm run web          # Web browser

# Code quality
npm run lint         # Run ESLint

# Utilities
npm run reset-project  # Reset to blank project
```

## 🔐 Authentication Features

The app includes a complete authentication system:

- **Sign Up**: Create new user accounts
- **Sign In**: Login with email and password
- **Password Recovery**: Forgot password flow
- **Password Reset**: Reset password with token
- **Email Confirmation**: Email verification
- **Session Management**: Automatic token refresh
- **Logout**: Secure session termination

Authentication state is managed through:

- `lib/auth-context.tsx` - React context for auth state
- `lib/api-client.ts` - API client with automatic token refresh
- AsyncStorage for token persistence

## 🎨 Customization

### Theme

Modify theme settings in `constants/theme.ts`:

```typescript
export const Colors = {
  light: {
    /* light theme colors */
  },
  dark: {
    /* dark theme colors */
  },
};
```

### App Configuration

Update app metadata in `app.json`:

- App name
- Version
- Icons and splash screens
- Platform-specific settings

## 🔍 Troubleshooting

### Common Issues

#### 1. Metro Bundler Cache Issues

```bash
# Clear Metro cache
npm start -- --clear
```

#### 2. Node Modules Issues

```bash
# Clean install
rm -rf node_modules
npm install
```

#### 3. Expo Cache Issues

```bash
# Clear Expo cache
npx expo start --clear
```

#### 4. iOS Build Issues (macOS)

```bash
cd ios
pod install
cd ..
npm run ios
```

#### 5. Android Build Issues

```bash
cd android
./gradlew clean
cd ..
npm run android
```

#### 6. Network Issues (Physical Device)

- Ensure your computer and device are on the same WiFi network
- Check firewall settings
- Update IP address in `lib/config.ts`

### Port Already in Use

If port 8081 is in use:

```bash
# Kill process on port 8081
npx kill-port 8081
# or
lsof -ti:8081 | xargs kill -9
```

## 📦 Dependencies

Key dependencies include:

- **Navigation**: `@react-navigation/native`, `expo-router`
- **Storage**: `@react-native-async-storage/async-storage`
- **HTTP**: `axios`
- **Animations**: `react-native-reanimated`, `react-native-gesture-handler`
- **Notifications**: `react-native-toast-message`
- **Icons**: `@expo/vector-icons`
- **Image**: `expo-image`
- **And more...**

See `package.json` for the complete list.

## 🌐 API Configuration

### Mock API Mode

By default, the app runs in mock API mode for development:

```typescript
// lib/mock-api.ts
export const USE_MOCK_API = true;
```

This allows you to test authentication flows without a backend.

### Connecting to Backend

1. Update `lib/config.ts` with your backend URL
2. Set `USE_MOCK_API = false` in `lib/mock-api.ts`
3. Ensure your backend implements the required endpoints:
   - `POST /auth/signup`
   - `POST /auth/signin`
   - `POST /auth/forgot-password`
   - `POST /auth/reset-password`
   - `POST /auth/refresh`
   - `POST /auth/logout`
   - `GET /users/me`

## 🧪 Testing

Currently, the project uses mock API for development. To test with a real backend:

1. Update API configuration
2. Start your backend server
3. Set `USE_MOCK_API = false`
4. Update IP address in config

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🤝 Support

For support and questions:

- Check the documentation
- Review existing issues
- Contact the development team

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

**Version**: 1.0.0  
**Built with**: Expo ~54.0.19, React 19.1.0, React Native 0.81.5  
**Platforms**: iOS, Android, Web
