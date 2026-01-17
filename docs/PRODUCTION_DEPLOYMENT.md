# Production Deployment Checklist

This guide ensures a smooth, error-free deployment to Vercel for the Lab68 Dev Platform.

## ✅ Pre-Deployment Checklist

### 1. Code Quality

- [ ] Run `pnpm lint` – No linting errors
- [ ] Run `pnpm build` – Successful build with no TypeScript errors
- [ ] Test all routes locally – No 404s or broken pages
- [ ] Check browser console – No JavaScript errors

### 2. Environment Variables

#### Required for All Deployments

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# JWT
JWT_SECRET=your-random-32-char-secret

# Email (choose one)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=Lab68 Dev Platform
```

#### AI Tools Configuration (RAG + Ollama)

**Ollama Local AI (Recommended)**

```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=deepseek-r1:7b
```

- Cost: **$0** (100% free, runs locally)
- Privacy: All data stays on your infrastructure
- Setup: See [docs/OLLAMA_SETUP.md](./OLLAMA_SETUP.md)

**For Production (Ollama on VPS)**

```env
OLLAMA_URL=https://ai.yourdomain.com
OLLAMA_MODEL=deepseek-r1:7b
```

- Requires separate VPS running Ollama
- Most cost-effective for high usage
- Complete privacy and control
- Setup: See [docs/PRODUCTION_DEPLOYMENT_OLLAMA.md](./PRODUCTION_DEPLOYMENT_OLLAMA.md)

### 3. Database Setup

- [ ] Supabase project created
- [ ] `supabase-staff-schema.sql` executed in SQL Editor
- [ ] Row-Level Security (RLS) policies enabled
- [ ] Test database connection locally

### 4. Security Checks

- [ ] Change default admin password (`admin@lab68dev.com`)
- [ ] JWT_SECRET is unique and strong (32+ characters)
- [ ] Email SMTP credentials are correct
- [ ] 2FA tested and working
- [ ] Rate limiting configured

## 🚀 Deployment Steps

### Step 1: Connect to Vercel

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Login to Vercel
vercel login

# Link project
vercel link
```

Or use GitHub integration:

1. Push code to GitHub
2. Import project in Vercel Dashboard
3. Connect repository

### Step 2: Configure Environment Variables

**In Vercel Dashboard:**

1. Go to **Settings** → **Environment Variables**
2. Add all required variables from checklist above
3. Set for **Production**, **Preview**, and **Development** environments

**Critical Variables:**

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `JWT_SECRET`
- ✅ `SMTP_*` variables
- ✅ `OLLAMA_URL` and `OLLAMA_MODEL` (for AI)

### Step 3: Deploy

```bash
# Production deployment
vercel --prod

# Or push to main branch (with GitHub integration)
git push origin main
```

### Step 4: Post-Deployment Verification

Visit your production URL and test:

- [ ] Homepage loads correctly
- [ ] Login/Signup works
- [ ] JWT authentication persists across refreshes
- [ ] Email notifications send successfully
- [ ] 2FA setup and verification works
- [ ] Dashboard loads all routes
- [ ] AI Tools chat works (check which provider is active)
- [ ] Projects, files, wiki, resume editor function
- [ ] Staff portal accessible
- [ ] No console errors in browser

## 🔍 Troubleshooting

### Build Errors

**"Module not found"**

```bash
# Clean install dependencies
rm -rf node_modules .next
pnpm install
pnpm build
```

**TypeScript errors**

```bash
# Check for type issues
pnpm type-check  # or pnpm build
```

**ESLint errors**

```bash
pnpm lint --fix
```

### Runtime Errors

**"AI not responding"**

- Check environment variables are set in Vercel
- Verify `OLLAMA_URL` points to running Ollama instance
- For local dev: Ensure Ollama is running (`ollama list`)
- For production: Check VPS Ollama server is accessible
- Check Vercel logs: `vercel logs --prod`

**"Database connection failed"**

- Verify Supabase URL and keys are correct
- Check Supabase project is not paused
- Ensure RLS policies allow access

**"Email not sending"**

- Verify SMTP credentials
- Check Gmail app password (not account password)
- Test with alternative SMTP provider

**"Session expired immediately"**

- Ensure `JWT_SECRET` is set in production
- Check secret is same across all deployments
- Clear browser cookies and try again

### Vercel-Specific Issues

**"Function exceeded timeout"**

- AI requests may take time on first call
- Consider using streaming responses
- Check Vercel function logs

**"Environment variable not found"**

- Redeploy after adding variables
- Check variable scope (Production/Preview/Development)

## 📊 Monitoring

### Vercel Dashboard

- **Analytics** – Page views, performance metrics
- **Logs** – Real-time function logs
- **Deployments** – Build history and rollback

### Recommended Setup

```bash
# Add to package.json
"scripts": {
  "deploy": "vercel --prod",
  "preview": "vercel",
  "logs": "vercel logs --prod"
}
```

## 🔐 Security Best Practices

1. **Never commit `.env.local`** – Already in `.gitignore`
2. **Rotate secrets regularly** – JWT_SECRET, API keys
3. **Use environment-specific secrets** – Different keys for staging/production
4. **Enable Vercel protection** – Password protect preview deployments
5. **Monitor API usage** – Set up billing alerts for AI APIs

## 💰 Cost Optimization

### AI Costs (per 1M tokens)

- **Ollama (self-hosted)**: VPS cost (~$50-200/month)
- **DeepSeek API**: ~$0.14
- **Gemini Free**: $0 (with rate limits)

### Recommendation

- **< 10k messages/month**: Use Gemini free tier
- **10k - 100k messages/month**: Use DeepSeek API (~$20-50/month)
- **> 100k messages/month**: Self-host Ollama on VPS

## ✅ Final Checklist

Before merging to main:

- [ ] All tests pass locally
- [ ] Build succeeds without errors
- [ ] Environment variables documented in this guide
- [ ] README.md updated with AI setup instructions
- [ ] `.env.example` includes all required variables
- [ ] No sensitive data in code
- [ ] Git commit messages are clear
- [ ] Branch is up to date with main

```bash
# Final verification
pnpm lint
pnpm build
git status
git push origin your-branch

# Create PR and merge to main
# Vercel will auto-deploy from main branch
```

## 🎉 Success

Your Lab68 Dev Platform is now live on Vercel with:

- ✅ Enterprise-grade security
- ✅ Staff management portal
- ✅ AI development assistant
- ✅ Real-time collaboration
- ✅ Supabase backend
- ✅ Email notifications
- ✅ Multi-language support

Visit your production URL and start building! 🚀

---

**Need Help?**

- Vercel Docs: <https://vercel.com/docs>
- Supabase Docs: <https://supabase.com/docs>
- Project Issues: <https://github.com/lab68dev/lab68dev-platform/issues>
