# Security Setup - Quick Start

## ⚡ Quick Setup (5 Minutes)

### Step 1: Generate JWT Secret

**Windows PowerShell:**

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Linux/Mac:**

```bash
openssl rand -base64 32
```

Copy the output - you'll need it for `.env.local`

---

### Step 2: Setup Gmail for Email Notifications

1. Go to your Google Account: <https://myaccount.google.com>
2. Navigate to **Security** → **2-Step Verification**
3. Scroll down to **App passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password

---

### Step 3: Create Supabase Project

1. Go to <https://supabase.com>
2. Click **"New Project"**
3. Fill in:
   - Name: `lab68dev-platform`
   - Database Password: (generate secure password)
   - Region: (choose closest to you)
4. Click **"Create new project"** (takes ~2 minutes)
5. Once created, go to **Settings** → **API**
6. Copy:
   - Project URL
   - `anon` `public` key

---

### Step 4: Run Database Schema

1. In Supabase dashboard, click **SQL Editor**
2. Click **"New query"**
3. Copy entire contents of `supabase-staff-schema.sql`
4. Paste into SQL editor
5. Click **"Run"** button
6. Should see: "Success. No rows returned"

---

### Step 5: Create .env.local File

Create a new file `.env.local` in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT Secret (from Step 1)
JWT_SECRET=your-generated-secret-from-step-1

# Email Configuration (Gmail from Step 2)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=lab68dev@gmail.com
SMTP_PASSWORD=your-16-char-app-password-from-step-2
FROM_EMAIL=lab68dev@gmail.com
FROM_NAME=Lab68 Dev Platform

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Replace the values with your actual credentials.

---

### Step 6: Restart Development Server

```bash
# Stop current server (Ctrl+C)

# Restart with new environment variables
pnpm dev
```

---

## ✅ Verify Setup

### Test Database Connection

1. Open your browser console (F12)
2. Run:

```javascript
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

You should see your Supabase URL in the console.

### Test Email Sending

1. Register a new staff account at `/staff/signup`
2. Approve the account (as admin)
3. Check your email inbox
4. You should receive approval email

### Test 2FA

1. Login to staff portal
2. Go to Settings → Security
3. Click "Enable Two-Factor Authentication"
4. Scan QR code with Google Authenticator
5. Enter 6-digit code
6. Save backup codes

---

## 🎯 Default Admin Credentials

The database schema automatically creates an admin account:

```text
Email: admin@lab68dev.com
Password: Admin@123456
```

**⚠️ CHANGE THIS PASSWORD IMMEDIATELY!**

---

## 🔍 Troubleshooting

### "Supabase not configured" Error

**Fix:** Check your `.env.local` file has correct Supabase URL and key.

```bash
# Verify environment variables are loaded
pnpm dev
# Look for: "Environment variables loaded successfully"
```

### Emails Not Sending

**Fix:**

1. Verify SMTP password is 16-character App Password (not your Gmail password)
2. Check 2-Step Verification is enabled on Gmail
3. Try sending test email:

```bash
# Create test file: test-email.js
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'lab68dev@gmail.com',
    pass: 'your-app-password'
  }
});
transporter.sendMail({
  from: 'lab68dev@gmail.com',
  to: 'your-email@example.com',
  subject: 'Test',
  text: 'Test email'
}).then(() => console.log('Email sent!'));
"
```

### Database Connection Failed

**Fix:**

1. Verify Supabase project is running (not paused)
2. Check URL format: `https://xxxxx.supabase.co` (no trailing slash)
3. Verify API key is the `anon` `public` key (not service_role)

---

## 📱 Using Alternative Email Providers

### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
```

### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASSWORD=your_mailgun_password
```

### Amazon SES

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your_ses_smtp_username
SMTP_PASSWORD=your_ses_smtp_password
```

---

## 🚀 Production Deployment

### Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - Go to **Settings** → **Environment Variables**
   - Add all variables from `.env.local`
   - Deploy

### Environment Variables Needed

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
JWT_SECRET
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
FROM_EMAIL
FROM_NAME
NEXT_PUBLIC_BASE_URL (use production URL)
```

---

## 📊 Security Checklist

Before going live:

- [ ] Change default admin password
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable Supabase RLS (Row Level Security)
- [ ] Use production email service (not Gmail)
- [ ] Enable 2FA for all admin accounts
- [ ] Set up monitoring/alerting
- [ ] Configure rate limiting appropriately
- [ ] Review and test all email templates
- [ ] Set up database backups
- [ ] Configure CORS properly

---

## 🎓 Next Steps

1. **Read full documentation:** `docs/SECURITY_IMPLEMENTATION.md`
2. **Test all features:** Login, 2FA, Emails, Rate Limiting
3. **Create additional staff:** Use signup flow
4. **Configure monitoring:** Set up Supabase alerts
5. **Production deploy:** Follow deployment guide

---

**Need Help?**

- Documentation: `docs/SECURITY_IMPLEMENTATION.md`
- Email: <lab68dev@gmail.com>
- Issues: GitHub repository

**Security Setup Complete!** 🔒✅
