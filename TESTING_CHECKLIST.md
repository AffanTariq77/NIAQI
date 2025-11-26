# ✅ Testing Checklist - Kajabi Storefront

## Pre-Testing Setup

### 1. Environment Check

- [ ] `.env` file has `EXPO_PUBLIC_KAJABI_STOREFRONT_URL=https://niaqi.mykajabi.com`
- [ ] No TypeScript errors in `courses.tsx`
- [ ] `react-native-webview` package installed

### 2. Server Setup

```bash
cd /Users/mac/Documents/GitHub/NIAQI/NIAQI
npx expo start
```

- [ ] Expo server starts successfully
- [ ] No bundling errors
- [ ] QR code displayed

---

## iOS Testing

### Simulator

- [ ] Open on iOS Simulator (press `i`)
- [ ] Navigate to Courses tab
- [ ] WebView loads Kajabi storefront
- [ ] No scrollbars visible around content
- [ ] Loading indicator appears then disappears
- [ ] Can scroll through courses smoothly
- [ ] Can tap on a course
- [ ] Course details page loads
- [ ] Can navigate back

### Physical Device (Optional)

- [ ] Scan QR code with iOS device
- [ ] Same tests as simulator
- [ ] Check performance on real device

---

## Android Testing

### Emulator

- [ ] Open on Android Emulator (press `a`)
- [ ] Navigate to Courses tab
- [ ] WebView loads Kajabi storefront
- [ ] No scrollbars visible around content
- [ ] Loading indicator appears then disappears
- [ ] Can scroll through courses smoothly
- [ ] Can tap on a course
- [ ] Course details page loads
- [ ] Can navigate back

### Physical Device (Optional)

- [ ] Scan QR code with Android device
- [ ] Same tests as emulator
- [ ] Check performance on real device

---

## Functional Testing

### Basic Navigation

- [ ] Courses tab opens correctly
- [ ] Bottom navigation still works
- [ ] Can switch between tabs
- [ ] WebView content preserved when switching back

### Kajabi Features

- [ ] Course catalog displays correctly
- [ ] Course images load
- [ ] Course descriptions readable
- [ ] Prices display correctly (if applicable)

### User Interactions

- [ ] Tap on course → Opens course details
- [ ] Scroll → Smooth native scrolling
- [ ] Pinch zoom → Works (if enabled)
- [ ] Swipe → No conflicts with tab navigation

### Authentication (Optional - if you have Kajabi account)

- [ ] Can navigate to login page
- [ ] Can enter credentials
- [ ] Can log in successfully
- [ ] Stay logged in when returning to tab
- [ ] Can log out

### Checkout Flow (Optional - if testing purchases)

- [ ] Can add course to cart
- [ ] Can view cart
- [ ] Can proceed to checkout
- [ ] Payment form loads correctly
- [ ] Can complete purchase (test mode)

---

## Performance Testing

### Load Time

- [ ] Initial load < 5 seconds (on good network)
- [ ] Subsequent loads < 2 seconds
- [ ] No freezing during load

### Scrolling

- [ ] Smooth scrolling at 60fps
- [ ] No lag when scrolling fast
- [ ] No rubber-banding issues

### Memory

- [ ] App doesn't crash after 5+ minutes
- [ ] No memory warnings in console
- [ ] Can switch tabs multiple times without issues

---

## Edge Cases

### Network Issues

- [ ] Poor network → Shows loading indicator
- [ ] No network → Shows appropriate message
- [ ] Network returns → Content loads automatically

### Orientation

- [ ] Portrait mode works
- [ ] Landscape mode works (if supported)
- [ ] Rotation doesn't break layout

### Background/Foreground

- [ ] Minimize app → Return to app
- [ ] Content still visible
- [ ] Login session preserved

---

## Visual Quality

### Layout

- [ ] Fullscreen (no gaps at edges)
- [ ] SafeArea respected (no content under notch)
- [ ] No visible scrollbars
- [ ] Content fits screen width

### Typography

- [ ] Text readable
- [ ] Correct font sizes
- [ ] Proper line spacing

### Images

- [ ] Course images load correctly
- [ ] No broken image placeholders
- [ ] Images properly sized

### Colors

- [ ] Kajabi branding preserved
- [ ] Loading indicator visible
- [ ] Good contrast

---

## Integration Testing

### With Other Tabs

- [ ] Home tab still works
- [ ] Search tab still works
- [ ] Profile tab still works
- [ ] No conflicts between tabs

### With Authentication

- [ ] If logged in app → Separate from Kajabi login
- [ ] Can have different Kajabi account
- [ ] Logout from app doesn't affect Kajabi

### With Backend

- [ ] No conflicts with existing API calls
- [ ] Backend still accessible from other screens

---

## Browser Compatibility (WebView)

### JavaScript

- [ ] JavaScript executes correctly
- [ ] No console errors (check debug mode)
- [ ] Injected JavaScript works

### Cookies

- [ ] Cookies saved correctly
- [ ] Third-party cookies work
- [ ] Session persists

### Local Storage

- [ ] DOM storage works
- [ ] Kajabi session data saved

---

## Error Handling

### Expected Errors

- [ ] Invalid URL → Shows error (test by changing URL)
- [ ] Network timeout → Appropriate message
- [ ] WebView crash → App doesn't crash

### User Errors

- [ ] Wrong credentials → Kajabi error message shows
- [ ] Payment fails → Kajabi handles gracefully

---

## Documentation Check

- [ ] README updated (if needed)
- [ ] Environment variables documented
- [ ] Configuration changes documented
- [ ] Troubleshooting guide available

---

## Deployment Readiness

### Code Quality

- [ ] No TypeScript errors
- [ ] No linter warnings
- [ ] Code properly formatted
- [ ] Comments added where needed

### Configuration

- [ ] Production URL ready (if different)
- [ ] Environment variables set
- [ ] Secrets not committed to git

### Testing

- [ ] Manual testing complete
- [ ] Edge cases tested
- [ ] Performance acceptable

---

## Final Checks

- [ ] App builds successfully
- [ ] No console errors
- [ ] No memory leaks
- [ ] Smooth user experience
- [ ] Ready for production

---

## Issue Tracking

### Found Issues

List any issues found during testing:

1. ***
2. ***
3. ***

### Resolved Issues

List issues that were fixed:

1. ✅ **********************\_\_\_**********************
2. ✅ **********************\_\_\_**********************
3. ✅ **********************\_\_\_**********************

---

## Sign-off

- [ ] All critical tests passed
- [ ] All major features working
- [ ] Performance acceptable
- [ ] Ready for user testing

**Tested by**: ********\_********  
**Date**: ********\_********  
**Version**: ********\_********

---

## Quick Fix Commands

### Restart Everything

```bash
# Kill all processes
killall node

# Clear cache
cd /Users/mac/Documents/GitHub/NIAQI/NIAQI
rm -rf node_modules
npm install

# Restart Expo
npx expo start --clear
```

### Check Logs

```bash
# iOS logs
xcrun simctl spawn booted log stream --predicate 'process == "Expo"'

# Android logs
adb logcat | grep Expo
```

### Debug WebView

Enable Chrome debugging:

1. Shake device
2. Select "Debug Remote JS"
3. Open Chrome DevTools

---

**Note**: This checklist is comprehensive. Not all items may apply to your specific use case. Focus on the critical path first.
