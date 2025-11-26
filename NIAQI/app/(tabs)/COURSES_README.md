# Courses Page - Kajabi Storefront Integration

## Overview

The Courses page now displays a fullscreen embedded Kajabi storefront, allowing users to browse, register for, and purchase courses directly within the app.

## Features Implemented

### ✅ Fullscreen Iframe Embed

- Uses React Native WebView to render the Kajabi storefront
- 100% width and height for seamless integration
- No visible scrollbars around the iframe

### ✅ Native-like Experience

- Smooth scrolling within the WebView
- Loading indicator while content loads
- SafeAreaView for proper spacing on iOS/Android

### ✅ External Link Handling

- Links within Kajabi domain open within the app
- External links can be configured to open in system browser
- JavaScript injection for link handling

### ✅ Full Kajabi Functionality

- Users can browse the course catalog
- Login/authentication handled by Kajabi
- Checkout and payment processed by Kajabi
- All Kajabi features work seamlessly

## Configuration

### Environment Variables (`.env`)

```properties
# Kajabi Storefront Configuration
EXPO_PUBLIC_KAJABI_STOREFRONT_URL=https://niaqi.mykajabi.com
```

### Config File (`lib/config.ts`)

```typescript
export const KAJABI_CONFIG = {
  STOREFRONT_URL:
    process.env.EXPO_PUBLIC_KAJABI_STOREFRONT_URL ||
    "https://niaqi.mykajabi.com",
};
```

## Technical Details

### Dependencies

- `react-native-webview`: For rendering the Kajabi storefront

### Platform Support

- ✅ iOS Simulator & Physical Devices
- ✅ Android Emulator & Physical Devices
- ✅ Web (with limitations)

### WebView Configuration

```typescript
<WebView
  source={{ uri: KAJABI_CONFIG.STOREFRONT_URL }}
  javaScriptEnabled={true}
  domStorageEnabled={true}
  showsVerticalScrollIndicator={false}
  showsHorizontalScrollIndicator={false}
  thirdPartyCookiesEnabled={true}
  sharedCookiesEnabled={true}
  mixedContentMode="compatibility"
/>
```

### JavaScript Injection

The app injects JavaScript to:

1. Remove unnecessary scrollbars
2. Configure external links to open in new tabs
3. Monitor dynamically added links

## Usage

### For Users

1. Navigate to the Courses tab
2. Browse the Kajabi course catalog
3. Click on any course to view details
4. Login or register as needed (handled by Kajabi)
5. Complete checkout (handled by Kajabi)

### For Developers

#### Changing the Kajabi URL

Update the `.env` file:

```properties
EXPO_PUBLIC_KAJABI_STOREFRONT_URL=https://your-kajabi-site.mykajabi.com
```

#### Customizing WebView Behavior

Edit `app/(tabs)/courses.tsx` and modify:

- `handleNavigationStateChange()` - Handle navigation events
- `injectedJavaScript` - Customize page behavior
- WebView props - Configure WebView settings

## Troubleshooting

### Issue: WebView not loading

**Solution**: Check internet connection and verify the Kajabi URL is correct

### Issue: Login/checkout not working

**Solution**: Ensure cookies are enabled (`thirdPartyCookiesEnabled` and `sharedCookiesEnabled`)

### Issue: Links opening incorrectly

**Solution**: Modify the `handleNavigationStateChange` function to handle specific URL patterns

### Issue: Content not responsive

**Solution**: Kajabi should handle responsiveness, but you can adjust with `scalesPageToFit` prop

## Future Enhancements

### Potential Improvements

- [ ] Add pull-to-refresh functionality
- [ ] Implement back/forward navigation buttons
- [ ] Add deep linking for specific courses
- [ ] Cache webview content for offline viewing
- [ ] Add analytics tracking for course views
- [ ] Implement native sharing functionality

### Custom Domain Integration

If you have a custom domain (e.g., www.floridamoldcourse.com):

1. Update `.env`:
   ```properties
   EXPO_PUBLIC_KAJABI_STOREFRONT_URL=https://www.floridamoldcourse.com
   ```
2. Restart the Expo development server

## Related Files

- `app/(tabs)/courses.tsx` - Main courses page component
- `lib/config.ts` - Configuration file with Kajabi URL
- `.env` - Environment variables

## Support

For Kajabi-specific issues, refer to:

- [Kajabi Documentation](https://help.kajabi.com)
- [Kajabi API Documentation](https://developers.kajabi.com)

For React Native WebView issues:

- [react-native-webview Documentation](https://github.com/react-native-webview/react-native-webview)
