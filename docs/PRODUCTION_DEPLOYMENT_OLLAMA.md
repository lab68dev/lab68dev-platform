# Production Deployment Guide - Ollama AI

Complete guide for deploying AI Tools with Ollama in production.

## Overview

This project uses **Ollama** for local AI processing. For production:
- Deploy Next.js on **Vercel** (or any platform)
- Run Ollama on separate **VPS server**
- Connect via HTTPS

---

## Pre-Deployment Checklist

### 1. Code Quality
- ✅ Zero TypeScript errors: `pnpm build`
- ✅ Zero ESLint errors: `pnpm lint`
- ✅ Git branch ready to merge to `main`

### 2. Environment Configuration
```env
# Ollama Configuration (update for production)
OLLAMA_URL=https://ai.yourdomain.com  # Change from localhost
OLLAMA_MODEL=deepseek-r1:7b
```

---

## VPS Setup (Production)

### Requirements
- **Minimum:** 8GB RAM, 20GB storage
- **Recommended:** 16GB RAM, 50GB storage
- **OS:** Ubuntu 22.04+

### Step 1: Install Ollama on VPS

```bash
# SSH into VPS
ssh root@your-vps-ip

# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull model
ollama pull deepseek-r1:7b

# Start service
systemctl start ollama
systemctl enable ollama
```

### Step 2: Configure HTTPS with Nginx

```bash
# Install Nginx and Certbot
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/ollama
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name ai.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:11434;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable and get SSL:
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ollama /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Get SSL certificate
sudo certbot --nginx -d ai.yourdomain.com
```

### Step 3: Test VPS

```bash
# From your local machine
curl https://ai.yourdomain.com/api/tags

# Should return: {"models":[{"name":"deepseek-r1:7b",...}]}
```

---

## Vercel Deployment

### Step 1: Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```env
# AI Configuration
OLLAMA_URL=https://ai.yourdomain.com
OLLAMA_MODEL=deepseek-r1:7b

# Database
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# JWT
JWT_SECRET=your-32-char-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Step 2: Deploy

```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys from main branch
# Or manually: vercel --prod
```

### Step 3: Test Production

1. Visit: `https://your-app.vercel.app/dashboard/ai-tools`
2. Send test message
3. Verify response shows "Ollama (Local)" provider

---

## Monitoring & Maintenance

### Check Ollama Status on VPS

```bash
# SSH into VPS
ssh root@your-vps-ip

# Check service status
systemctl status ollama

# View logs
journalctl -u ollama -f

# Restart if needed
systemctl restart ollama
```

### Update Model

```bash
# Pull new model
ollama pull deepseek-r1:8b

# Update environment variable in Vercel
# OLLAMA_MODEL=deepseek-r1:8b
```

---

## Troubleshooting

**Issue: Connection timeout**
- Check VPS firewall allows HTTPS (port 443)
- Verify Ollama running: `systemctl status ollama`
- Test locally: `curl http://localhost:11434/api/tags`

**Issue: SSL certificate errors**
- Renew certificate: `sudo certbot renew`
- Check nginx config: `sudo nginx -t`

**Issue: Slow responses**
- Upgrade VPS RAM/CPU
- Use smaller model: `ollama pull deepseek-r1:1.5b`

---

## Cost Breakdown

### VPS Hosting (Monthly)
- DigitalOcean Droplet (8GB): $48/month
- Hetzner Cloud (8GB): ~$20/month ⭐ Best value
- AWS EC2 t3.large: ~$60/month

### Vercel Hosting
- Pro Plan: $20/month (recommended for production)

### Total Cost
- **~$40-80/month** for unlimited AI usage
- **Zero per-request costs**
- **Complete data privacy**

Compare to cloud APIs:
- DeepSeek: ~$0.14 per 1M tokens
- 100K messages/month = ~$14/month (but data sent to third party)

---

## Benefits Summary

✅ **Complete Privacy** - Your data never leaves your infrastructure  
✅ **Zero API Costs** - No per-request charges  
✅ **Unlimited Usage** - No rate limits or quotas  
✅ **Full Control** - Choose any model, customize parameters  
✅ **Fast Responses** - Direct server connection  
✅ **Offline Capable** - Works without external APIs
