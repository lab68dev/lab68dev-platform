# Quick Start: Supabase Integration

## ✅ What's Been Done

Your Lab68 Dev Platform is now integrated with Supabase authentication! Here's what was implemented:

### 1. **Packages Installed**

- `@supabase/supabase-js` - Supabase JavaScript client
- `@supabase/ssr` - Server-side rendering helpers for Next.js

### 2. **Files Created**

- `lib/supabase.ts` - Supabase client configuration
- `middleware.ts` - Route protection and session management
- `supabase-schema.sql` - Database schema for user profiles
- `.env.local` - Environment variables (needs your credentials)
- `.env.local.example` - Template for environment variables
- `SUPABASE_SETUP.md` - Comprehensive setup guide
- `lib/useAuth.ts` - React hook for auth state management

### 3. **Files Updated**

- `lib/auth.ts` - Now uses Supabase Auth instead of localStorage
- `app/login/page.tsx` - Async authentication with Supabase
- `app/signup/page.tsx` - User registration with profile creation
- `components/dashboard-sidebar.tsx` - Async sign out
- `README.md` - Added authentication section

## 🚀 Next Steps (Required)

### Step 1: Create Supabase Project

1. Go to <https://supabase.com/dashboard>
2. Click "New Project"
3. Fill in:
   - **Project Name**: lab68dev-platform
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you
4. Click "Create new project" (takes ~2 minutes)

### Step 2: Get Your API Keys

1. In Supabase dashboard, go to **Settings** (gear icon)
2. Click **API**
3. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long JWT token)

### Step 3: Update .env.local

Open `.env.local` and paste your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the entire contents of `supabase-schema.sql`
4. Paste into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see: "Success. No rows returned"

This creates:

- `profiles` table for user data
- Row Level Security policies
- Automatic trigger to create profiles on signup

### Step 5: Test It Out

```bash
# Restart your dev server
pnpm dev
```

1. Open <http://localhost:3000/signup>
2. Create a test account
3. Check Supabase dashboard:
   - **Authentication → Users** (should show your user)
   - **Table Editor → profiles** (should show your profile)
4. Try logging out and back in

## 🎯 Key Features Now Working

✅ **Secure Authentication** - Passwords hashed with bcrypt by Supabase
✅ **User Profiles** - Name, bio, location, website, avatar stored in database
✅ **Protected Routes** - Middleware redirects unauthenticated users
✅ **Session Management** - Automatic token refresh
✅ **Email Verification** - Built-in (can be configured in Supabase)
✅ **Remember Me** - Persistent sessions
✅ **Sign Out** - Proper session cleanup

## 📝 Important Notes

### Development vs Production

**For Development (current setup)**:

- Email confirmation is optional (can disable in Supabase settings)
- Using localhost URL

**For Production (when deploying)**:

1. Add production URL to Supabase: **Authentication → URL Configuration**
2. Enable email confirmation
3. Consider adding OAuth providers (Google, GitHub, etc.)

### Data Storage

- **Before**: All data stored in localStorage
- **Now**: User authentication in Supabase Auth, profiles in PostgreSQL database
- **Other features**: Projects, files, whiteboards, etc. still use localStorage (can migrate later)

### Backward Compatibility

The code maintains a `getCurrentUser()` function that:

- Returns cached user data synchronously (for existing components)
- Gets updated after login/signup
- Can be upgraded to use `useAuth()` hook for real-time updates

## 🔧 Troubleshooting

### "Failed to fetch" or "Invalid API key"

- Check `.env.local` has correct values
- Restart dev server after changing `.env.local`
- Ensure no extra spaces in environment variables

### Users created but no profile

- Make sure you ran `supabase-schema.sql`
- Check SQL Editor for errors
- Verify trigger exists: **Database → Functions**

### Can't sign in

- Check Supabase logs: **Logs → Auth Logs**
- Verify email confirmation settings
- Try creating a new user

## 📚 Additional Resources

- **Full Setup Guide**: `SUPABASE_SETUP.md`
- **Supabase Docs**: <https://supabase.com/docs>
- **Next.js Auth Guide**: <https://supabase.com/docs/guides/auth/server-side/nextjs>

## 🎉 That's It

Your authentication is now powered by Supabase! Users can sign up, log in, and their data is securely stored in a production-grade PostgreSQL database.

For detailed information, see `SUPABASE_SETUP.md`.
