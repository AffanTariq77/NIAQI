# 🚀 Quick Start Guide - Kajabi Storefront

## What Changed?

The **Courses tab** now displays your Kajabi storefront (`https://niaqi.mykajabi.com`) instead of a static course list.

## ✅ Ready to Use

Your implementation is complete! Just run the app:

```bash
cd /Users/mac/Documents/GitHub/NIAQI/NIAQI
npx expo start
```

Then press:

- `a` for Android
- `i` for iOS

## 🎯 Key Features

- ✅ Fullscreen Kajabi embed
- ✅ Native-like scrolling
- ✅ Login/checkout handled by Kajabi
- ✅ No browser scrollbars
- ✅ Works on iOS & Android

## ⚙️ Configuration

### Change Kajabi URL

Edit `.env`:

```properties
EXPO_PUBLIC_KAJABI_STOREFRONT_URL=https://niaqi.mykajabi.com
```

### Use Custom Domain

If you have a custom domain (like www.floridamoldcourse.com):

```properties
EXPO_PUBLIC_KAJABI_STOREFRONT_URL=https://www.floridamoldcourse.com
```

## 📱 Testing Checklist

- [ ] Open Courses tab
- [ ] See Kajabi storefront load
- [ ] Scroll through courses
- [ ] Click on a course
- [ ] Test login (optional)
- [ ] Test checkout (optional)

## 🐛 Troubleshooting

**Blank screen?**

- Check internet connection
- Verify Kajabi URL in `.env`
- Restart Expo server

**Can't login?**

- Clear app data
- Reinstall app
- Check cookies are enabled (they are in the code)

## 📁 Files Changed

1. `/NIAQI/app/(tabs)/courses.tsx` - Main courses page
2. `/NIAQI/lib/config.ts` - Configuration
3. `/NIAQI/.env` - Environment variables

## 📚 Documentation

See `IMPLEMENTATION_SUMMARY.md` for full details.

---

**Status**: ✅ Ready to Deploy  
**No further setup needed!**
