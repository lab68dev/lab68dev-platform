# Supabase Authentication Setup Guide

This guide will help you integrate Supabase authentication into your Lab68 Dev Platform.

## Prerequisites

- A Supabase account (free tier is fine)
- Node.js and pnpm installed

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in your project details:
   - **Name**: lab68dev-platform (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project" and wait for setup to complete (~2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, click on the **Settings** icon (gear icon) in the sidebar
2. Navigate to **API** section
3. Find these two values:
   - **Project URL**: Something like `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: A long JWT token starting with `eyJ...`

## Step 3: Configure Environment Variables

1. Open the `.env.local` file in your project root
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**: Never commit `.env.local` to version control! It's already in `.gitignore`.

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to the **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy and paste the entire contents of `supabase-schema.sql` into the editor
4. Click **Run** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
5. You should see "Success. No rows returned" - this is correct!

This script creates:

- A `profiles` table to store user data (name, bio, avatar, etc.)
- Row Level Security (RLS) policies for data protection
- Automatic triggers to create profiles when users sign up
- Automatic timestamp updates

## Step 5: Configure Email Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. Scroll down to **Email Templates** (optional but recommended):
   - Customize the confirmation email if needed
   - Set your site URL (for production): `https://yourdomain.com`
   - For development, use: `http://localhost:3000`

## Step 6: Test Your Integration

### Start the Development Server

```bash
pnpm dev
```

### Test Sign Up

1. Navigate to <http://localhost:3000/signup>
2. Fill in the form with:
   - Name: Test User
   - Email: `test@example.com`
   - Password: test123456
3. Click "Sign Up"
4. Check your email for a confirmation link (if email confirmation is enabled)
5. You should be redirected to `/dashboard`

### Verify in Supabase

1. Go to **Authentication** → **Users** in Supabase dashboard
2. You should see your new user listed
3. Go to **Table Editor** → **profiles**
4. You should see a profile row with your user data

### Test Sign In

1. Sign out from the dashboard
2. Navigate to `http://localhost:3000/login`
3. Enter your email and password
4. Click "Sign In"
5. You should be redirected to `/dashboard`

## Step 7: (Optional) Disable Email Confirmation for Development

If you want to skip email confirmation during development:

1. Go to **Authentication** → **Settings** in Supabase
2. Scroll to **Email Auth**
3. **Disable** "Confirm email"
4. Click **Save**

**Important**: Re-enable this for production!

## Features Now Available

✅ **Secure Authentication**: Industry-standard auth with Supabase
✅ **User Profiles**: Name, bio, location, website, avatar
✅ **Protected Routes**: Automatic redirects for auth/unauth users
✅ **Session Management**: Persistent sessions with "Remember Me"
✅ **Password Security**: Bcrypt hashing handled by Supabase
✅ **Email Verification**: Built-in email confirmation
✅ **Password Reset**: Built-in password recovery (coming soon in UI)

## Migrating Existing Users (If Applicable)

If you have users in localStorage from development, you'll need to have them sign up again with Supabase. The old localStorage-based auth has been fully replaced.

## Troubleshooting

### "Invalid API key" or "Failed to fetch"

- Check that your `.env.local` file has the correct values
- Restart your dev server after changing `.env.local`
- Make sure there are no extra spaces in the environment variables

### "relation 'profiles' does not exist"

- Make sure you ran the `supabase-schema.sql` script
- Check the SQL Editor for any errors

### Users can sign up but profile isn't created

- Check the SQL Editor for errors in the trigger
- Verify RLS policies are set up correctly
- Check Supabase logs: **Database** → **Logs**

### "Auth session missing"

- Clear browser localStorage and cookies
- Sign out and sign in again
- Check browser console for errors

## Next Steps

### Add Password Reset

Update your login page to include a "Forgot Password?" link:

```typescript
const handleResetPassword = async (email: string) => {
  const supabase = createClient()
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
}
```

### Add Social Login

Enable OAuth providers in Supabase:

1. **Authentication** → **Providers**
2. Enable Google, GitHub, etc.
3. Configure OAuth credentials

### Production Deployment

Before deploying to production:

1. ✅ Enable email confirmation
2. ✅ Set up custom SMTP (optional, for branded emails)
3. ✅ Configure site URL in Supabase settings
4. ✅ Add redirect URLs for your production domain
5. ✅ Review and adjust RLS policies as needed
6. ✅ Set up database backups

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Dashboard](https://supabase.com/dashboard)

## Support

If you encounter issues:

1. Check the [Supabase Discord](https://discord.supabase.com)
2. Review [Supabase GitHub Issues](https://github.com/supabase/supabase/issues)
3. Check browser console and Supabase logs for error messages
