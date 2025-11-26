# 🔧 Google Drive Integration Setup Guide

## Current Error

```
Error: error:1E08010C:DECODER routines::unsupported
```

**Cause**: The service account key file contains placeholder values instead of real credentials.

---

## ✅ Complete Setup Steps

### Step 1: Download Service Account Key

1. **Go to Google Cloud Console**:

   - Visit: https://console.cloud.google.com/
   - Select project: `niaqi-478514`

2. **Navigate to Service Accounts**:

   - Go to: IAM & Admin → Service Accounts
   - Direct link: https://console.cloud.google.com/iam-admin/serviceaccounts?project=niaqi-478514

3. **Find Your Service Account**:

   - Look for: `niaqi-831@niaqi-478514.iam.gserviceaccount.com`

4. **Create a Key**:

   - Click on the service account
   - Go to the "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose format: **JSON**
   - Click "Create" (file will download automatically)

5. **Replace the Key File**:

   ```bash
   # The downloaded file will be named something like:
   # niaqi-478514-abc123xyz456.json

   # Copy its contents and replace:
   # /Users/mac/Documents/GitHub/NIAQI/NIAQI_Backend/keys/service-account.json
   ```

### Step 2: Enable Google Drive API

1. **Visit Google Drive API Page**:

   - https://console.cloud.google.com/apis/library/drive.googleapis.com?project=niaqi-478514

2. **Click "ENABLE"** if not already enabled

3. **Verify APIs are Enabled**:
   - Google Drive API ✅
   - Google Docs API (optional) ✅

### Step 3: Share Google Drive Folder

**Your Folder**: https://drive.google.com/drive/folders/1cu_dcoMjJ9b1dyBUvBw6MdbiCWy2cxqw

1. Open the folder in Google Drive
2. Click the **"Share"** button (top right)
3. Add email: `niaqi-831@niaqi-478514.iam.gserviceaccount.com`
4. Set permission: **Viewer**
5. **Uncheck** "Notify people"
6. Click **"Share"**

### Step 4: Configure Backend

**Already configured!** ✅

Your folder ID has been added to `.env`:

```properties
GOOGLE_DRIVE_FOLDER_ID="1cu_dcoMjJ9b1dyBUvBw6MdbiCWy2cxqw"
```

### Step 5: Start Backend Server

```bash
cd NIAQI_Backend
npm run start:dev
```

### Step 6: Test the Sync

Once the backend is running:

1. **Manual Sync**:

   ```bash
   curl http://localhost:5000/documents/sync/now
   ```

2. **List Documents**:

   ```bash
   curl http://localhost:5000/documents
   ```

3. **Check Logs**:
   Look for:
   ```
   [GoogleDriveService] Starting Google Drive sync...
   [GoogleDriveService] Listing files from folder: 1cu_dcoMjJ9b1dyBUvBw6MdbiCWy2cxqw
   [GoogleDriveService] Found X files in Google Drive
   [GoogleDriveService] Google Drive sync completed successfully
   ```

---

## 🎯 What the Real Service Account Key Should Look Like

```json
{
  "type": "service_account",
  "project_id": "niaqi-478514",
  "private_key_id": "abc123def456...", // Real ID
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n", // Real key
  "client_email": "niaqi-831@niaqi-478514.iam.gserviceaccount.com",
  "client_id": "123456789012345678901", // Real client ID
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/niaqi-831%40niaqi-478514.iam.gserviceaccount.com", // Real URL
  "universe_domain": "googleapis.com"
}
```

**Key differences**:

- `private_key` starts with `-----BEGIN PRIVATE KEY-----`
- All IDs and URLs are real values (not "REPLACE*WITH*...")
- The `private_key` is a long base64-encoded string with `\n` characters

---

## 🧪 Testing the Complete Flow

Once everything is set up:

### Backend Test:

1. Start backend: `npm run start:dev`
2. Check logs for successful authentication
3. Trigger sync: Visit `http://localhost:5000/documents/sync/now`
4. List documents: Visit `http://localhost:5000/documents`

### Frontend Test:

1. Start app: `npx expo start`
2. Sign in with a Premium or Premium Plus account
3. Go to Membership Details screen
4. Click on "Resource Library" or "Documents & Processes"
5. You should see your Google Drive files listed
6. Download and open a file
7. Verify progress tracking updates

---

## 🚨 Common Issues

### Issue 1: "DECODER routines::unsupported"

**Solution**: Replace placeholder values with real service account key

### Issue 2: "No files found"

**Solution**:

- Verify folder is shared with service account email
- Check folder ID in .env matches your Drive folder
- Ensure files exist in the folder (not in subfolders)

### Issue 3: "Permission denied"

**Solution**:

- Verify service account has "Viewer" permission on folder
- Check Google Drive API is enabled
- Ensure service account key is valid

### Issue 4: "Files not syncing automatically"

**Solution**:

- Cron job runs every 5 minutes
- Check backend logs for sync execution
- Manually trigger: `GET /documents/sync/now`

---

## 📁 File Structure

```
NIAQI_Backend/
├── keys/
│   └── service-account.json  ← Replace with real key
├── .env                      ← Folder ID already added
└── src/
    └── google-drive/
        ├── google-drive.service.ts  ← Updated to use folder ID
        ├── google-drive.controller.ts
        ├── google-drive.module.ts
        └── google-drive-sync.task.ts
```

---

## ✅ Checklist

- [ ] Download service account JSON key from Google Cloud
- [ ] Replace `/keys/service-account.json` with real key
- [ ] Enable Google Drive API in Google Cloud Console
- [ ] Share Drive folder with service account email
- [ ] Verify folder ID in `.env` (already done)
- [ ] Start backend server
- [ ] Test manual sync endpoint
- [ ] Check logs for successful sync
- [ ] Test frontend Resource Library
- [ ] Verify document download and progress tracking

---

## 🎉 Next Steps

After completing setup:

1. The backend will automatically sync every 5 minutes
2. New files added to Drive will appear in the app
3. Users can download, view, and track their progress
4. Premium/Premium Plus members have full access
