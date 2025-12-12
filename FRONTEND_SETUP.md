# 📱 Frontend Configuration - Using Production Backend

## ✅ Backend Deployed Successfully!

Your backend is live at: **https://niaqi-backend.onrender.com**

---

## 🎯 Frontend Setup Complete

### 1. Updated `.env` File ✅

```env
# Production Backend (Render)
EXPO_PUBLIC_API_HOST=niaqi-backend.onrender.com
EXPO_PUBLIC_API_PORT=443
EXPO_PUBLIC_API_PROTOCOL=https
```

### 2. Updated `lib/config.ts` ✅

The app now automatically detects and uses:

- **Production**: `https://niaqi-backend.onrender.com/api`
- **Development**: `http://localhost:5000/api` (or platform-specific)

---

## 🚀 Running Your App

### ❌ Don't Install expo-cli Globally

You don't need `npm install -g expo-cli` anymore!

### ✅ Use npx Instead

```bash
cd "/Users/mac/Documents/GitHub/NIAQI MAIN/NIAQI"
npx expo start
```

Or use these commands:

```bash
# Start development server
npm start

# Start with cache cleared
npx expo start --clear

# Start for specific platform
npx expo start --ios
npx expo start --android
npx expo start --web
```

---

## 📱 Testing with Production Backend

### Current Configuration:

- **API Base URL**: `https://niaqi-backend.onrender.com/api`
- **Protocol**: HTTPS
- **Port**: 443 (default HTTPS)

### Test Endpoints:

```bash
# Health check
curl https://niaqi-backend.onrender.com/api

# Membership plans
curl https://niaqi-backend.onrender.com/api/membership/plans

# Test signup
curl -X POST https://niaqi-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!","name":"Test User"}'
```

---

## 🔄 Switch Between Development and Production

### For Local Development:

Update `.env`:

```env
# EXPO_PUBLIC_API_HOST=niaqi-backend.onrender.com
# EXPO_PUBLIC_API_PORT=443
# EXPO_PUBLIC_API_PROTOCOL=https

# Local development
EXPO_PUBLIC_API_HOST=localhost
EXPO_PUBLIC_API_PORT=5000
EXPO_PUBLIC_API_PROTOCOL=http
```

### For Production:

Update `.env`:

```env
# Production (current)
EXPO_PUBLIC_API_HOST=niaqi-backend.onrender.com
EXPO_PUBLIC_API_PORT=443
EXPO_PUBLIC_API_PROTOCOL=https
```

---

## 📊 How It Works

The `lib/config.ts` automatically detects the backend:

```typescript
// Detects if using production backend
const isProduction = API_HOST.includes("onrender.com");

// Builds the correct URL
BASE_URL: isProduction
  ? `https://niaqi-backend.onrender.com/api` // Production
  : `http://localhost:5000/api`; // Development
```

---

## 🧪 Verify Configuration

### 1. Check Your Config:

```bash
cd "/Users/mac/Documents/GitHub/NIAQI MAIN/NIAQI"
cat .env | grep API
```

Should show:

```
EXPO_PUBLIC_API_HOST=niaqi-backend.onrender.com
EXPO_PUBLIC_API_PORT=443
EXPO_PUBLIC_API_PROTOCOL=https
```

### 2. Start the App:

```bash
npx expo start --clear
```

### 3. Test API Connection:

- Open the app in Expo Go or simulator
- Try to sign up/login
- Check if it connects to production backend

---

## 🐛 Troubleshooting

### Issue: "Network Error" or "Cannot Connect"

**Solution:**

- Check if backend is running: `curl https://niaqi-backend.onrender.com/api`
- Verify `.env` has correct values
- Restart Expo: `npx expo start --clear`

### Issue: "Permission Denied" for Global Install

**Solution:**

- Don't use `npm install -g expo-cli`
- Use `npx expo` instead (no global install needed)

### Issue: App Still Connects to Localhost

**Solution:**

```bash
# Clear cache and restart
npx expo start --clear

# Or rebuild
rm -rf node_modules
npm install
npx expo start
```

---

## 📋 Quick Commands

```bash
# Start Expo (recommended)
npx expo start

# Start with cleared cache
npx expo start --clear

# Start for iOS
npx expo start --ios

# Start for Android
npx expo start --android

# Install dependencies
npm install

# Run on web
npx expo start --web
```

---

## ✅ What's Configured

- ✅ Backend URL: `https://niaqi-backend.onrender.com`
- ✅ API Base: `https://niaqi-backend.onrender.com/api`
- ✅ Protocol: HTTPS
- ✅ Auto-detection: Production vs Development
- ✅ Platform-specific localhost handling
- ✅ No need for global expo-cli

---

## 🎉 You're Ready!

Your frontend is now configured to use the deployed backend!

**Start your app:**

```bash
cd "/Users/mac/Documents/GitHub/NIAQI MAIN/NIAQI"
npx expo start
```

**Backend is live at:** https://niaqi-backend.onrender.com 🚀
