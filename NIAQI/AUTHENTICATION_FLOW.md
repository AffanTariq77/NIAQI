# Authentication Flow Documentation

This document describes the complete authentication flow implementation for the NIAQI mobile application.

## 📁 Created Files

### Shared Components (in `components/`)
1. **GradientBackground.tsx** - Reusable gradient background component
2. **CustomTextInput.tsx** - Custom input field with validation indicators
3. **PrimaryButton.tsx** - Styled primary action button

### Authentication Screens (in `app/`)
1. **forgot-password.tsx** - Forgot password screen
2. **reset-password.tsx** - Reset password with new password input
3. **password-reset-done.tsx** - Password reset confirmation screen
4. **signup.tsx** - User registration screen

### Updated Files
- **app/login.tsx** - Updated to integrate with auth context and navigate to new screens

## 🎨 Design Features

### Visual Design
- **Gradient Background**: Soft blue to pink gradient (`#E0E8F5` → `#F0E8F8` → `#F5E8F0`)
- **Consistent Spacing**: `paddingHorizontal: 24`, `paddingTop: 40`
- **Rounded Inputs**: 10px border radius with shadow
- **Black Buttons**: Solid black background with white text
- **Validation Indicators**: Green checkmark when input is valid

### Typography
- Headers: 18px, bold, centered
- Titles: 32px, bold (Sign Up screen)
- Labels: 14px, gray
- Instructions: 14px, gray, line-height: 20

## 🔐 Screens Overview

### 1. Forgot Password Screen (`/forgot-password`)
**Features:**
- Email input with validation
- Automatic validation with checkmark
- "Send" button navigates to password reset confirmation
- Calls `apiClient.forgotPassword()`

**Navigation:**
- Back button → Previous screen
- Send button → Password Reset Done screen

### 2. Password Reset Done Screen (`/password-reset-done`)
**Features:**
- Displays NIAQI logo
- Shows "Your Password Has Been Reset!" message
- "Done" button navigates to Sign In screen

**Navigation:**
- Done button → Login screen

### 3. Reset Password Screen (`/reset-password`)
**Features:**
- Two password input fields (New & Confirm)
- Password visibility toggles (eye icons)
- Validates password match before enabling submit
- Calls `apiClient.resetPassword()`

**Navigation:**
- Back button → Previous screen
- Change Password button → Password Reset Done screen

### 4. Sign Up Screen (`/signup`)
**Features:**
- Name input with validation
- Email input with validation
- Password input with visibility toggle
- Confirm password input with visibility toggle
- "Sign Up" button
- "Already have an account? Sign in." link
- "Continue with Google" button (placeholder)

**Navigation:**
- Back button → Previous screen
- Sign Up button → Login screen (after successful registration)
- Sign in link → Login screen
- Google button → Placeholder action

## ⚙️ Technical Implementation

### State Management
- Uses React hooks (`useState`) for local state
- Integrates with `useAuth` context for authentication
- Toast notifications for user feedback
- Loading states for async operations

### Validation
- **Email**: Regex validation (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- **Password**: Minimum 8 characters
- **Match validation**: For password confirmation fields
- **Real-time feedback**: Checkmarks appear on valid input

### API Integration
All screens integrate with the existing `apiClient`:
- `forgotPassword({ email })`
- `resetPassword({ userId, token, newPassword, confirmPassword })`
- `signUp({ name, email, password, confirmPassword })`
- `signIn({ email, password, rememberMe })`

### Keyboard Handling
- `KeyboardAvoidingView` for iOS/Android compatibility
- `ScrollView` with `keyboardShouldPersistTaps="handled"`
- Proper keyboard dismissal on button press

### Navigation
Uses Expo Router's `useRouter()`:
- `router.push()` for navigation
- `router.replace()` for auth state changes
- `router.back()` for back navigation

## 🔄 Complete User Flow

### Registration Flow
1. User lands on Sign Up screen
2. Enters name, email, password, and confirms password
3. Clicks "Sign Up"
4. API call to register user
5. Success toast → Navigate to Login

### Forgot Password Flow
1. User clicks "Forgot password?" on Login
2. Enters email on Forgot Password screen
3. Clicks "Send"
4. API call to send reset email
5. Navigate to Password Reset Done screen
6. User receives email with reset link
7. Clicks link → Opens Reset Password screen
8. Enters new password and confirms
9. Clicks "Change Password"
10. Navigate to Password Reset Done screen
11. Click "Done" → Return to Login

### Sign In Flow
1. User enters email and password
2. Clicks "Sign In"
3. API call to authenticate
4. Success toast → Navigate to Main App (Tabs)

## 🎯 Key Features

### User Experience
- ✅ Smooth animations and transitions
- ✅ Loading states during API calls
- ✅ Toast notifications for feedback
- ✅ Form validation with visual indicators
- ✅ Password visibility toggles
- ✅ Keyboard-aware layouts
- ✅ Responsive design for all screen sizes

### Code Quality
- ✅ TypeScript for type safety
- ✅ Reusable components
- ✅ Consistent styling
- ✅ Error handling
- ✅ No linter errors
- ✅ Follows project structure

## 📱 Platform Support
- ✅ iOS (with KeyboardAvoidingView)
- ✅ Android (with KeyboardAvoidingView)
- ✅ Web (responsive design)

## 🚀 Next Steps (Optional Enhancements)
1. Add actual Google Sign-In integration
2. Add biometric authentication (Face ID / Touch ID)
3. Add social login (Facebook, Twitter)
4. Add email verification flow
5. Add remember me functionality persistence
6. Add auto-fill support
7. Add password strength indicator

