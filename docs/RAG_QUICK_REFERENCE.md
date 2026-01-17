# 🚀 RAG + Ollama Quick Reference

## ✅ What We Use Now

**Single AI Architecture: RAG + Ollama**

- **Embeddings**: Xenova/all-MiniLM-L6-v2 (384 dimensions)
- **Vector DB**: Supabase pgvector
- **AI Model**: Ollama (deepseek-r1:7b or compatible)
- **Cost**: $0 for AI (infrastructure costs only)
- **Privacy**: 100% local/private

---

## 🛠️ Quick Setup

### 1. Install Ollama

**Windows:**
```powershell
# Download from https://ollama.com
# Run installer
```

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### 2. Pull Model

```bash
ollama pull deepseek-r1:7b
```

### 3. Verify

```bash
ollama list
# Should show: deepseek-r1:7b
```

### 4. Run Dev Server

```powershell
pnpm dev
# or
.\start-dev.ps1
```

---

## 🧠 How RAG Works

```
User: "How do I add a collaborator?"
     ↓
1. Convert question to 384D vector
     ↓
2. Search knowledge_base table (pgvector)
     ↓
3. Find top 3 similar docs (similarity > 0.7)
     ↓
4. Build context: [relevant docs] + user question
     ↓
5. Send to Ollama (deepseek-r1:7b)
     ↓
6. AI responds with context-aware answer
```

---

## 📊 Status Indicators

| Indicator | Meaning |
|-----------|---------|
| 🟣 Purple pulse + "RAG-Enhanced" | RAG context found & used |
| 🟢 Green pulse + "Ollama" | Ollama running without RAG |
| Error message | Ollama not running |

---

## 🔧 Environment Variables

```env
# Required for AI
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=deepseek-r1:7b

# Required for RAG
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

---

## 🗄️ Database Setup

```sql
-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Create knowledge base table
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  embedding vector(384),
  metadata JSONB,
  category TEXT,
  source TEXT,
  title TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add vector similarity index
CREATE INDEX ON knowledge_base 
USING ivfflat (embedding vector_cosine_ops);
```

---

## 📚 Index Documentation

```bash
# Index all docs for RAG
node scripts/index-knowledge.js

# This creates embeddings for:
# - README.md
# - docs/*.md
# - Code comments
# - Feature descriptions
```

---

## 🐛 Troubleshooting

### "AI not responding"

```bash
# 1. Check if Ollama is running
ollama list

# 2. Verify model is downloaded
ollama pull deepseek-r1:7b

# 3. Test Ollama directly
ollama run deepseek-r1:7b
# Type: "Hello"
# Should respond
# Type: /bye to exit

# 4. Check environment variables
echo $OLLAMA_URL  # Should be http://localhost:11434
```

### "RAG not working"

1. **Check Supabase connection**
   - Verify `NEXT_PUBLIC_SUPABASE_URL`
   - Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Check knowledge_base table**
   ```sql
   SELECT COUNT(*) FROM knowledge_base;
   -- Should have documents indexed
   ```

3. **Re-index documentation**
   ```bash
   node scripts/index-knowledge.js
   ```

### "Slow responses"

- Use smaller model: `ollama pull llama3.2` (3B instead of 7B)
- Close other apps to free RAM
- Consider GPU for faster inference

---

## 📈 Production Deployment

### Option A: Vercel + VPS

1. **Deploy Next.js to Vercel**
   ```bash
   vercel --prod
   ```

2. **Run Ollama on VPS** (DigitalOcean, AWS, etc.)
   ```bash
   # On VPS
   curl -fsSL https://ollama.com/install.sh | sh
   ollama pull deepseek-r1:7b
   
   # Set up reverse proxy (nginx)
   # Configure SSL
   ```

3. **Update Vercel env vars**
   ```env
   OLLAMA_URL=https://ai.yourdomain.com
   ```

### Option B: All Local (Development)

```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=deepseek-r1:7b
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app/api/chat/route.ts` | RAG-enhanced chat API |
| `lib/services/rag-service.ts` | RAG embedding & retrieval |
| `app/dashboard/ai-tools/page.tsx` | Chat UI |
| `scripts/index-knowledge.js` | Knowledge indexer |
| `docs/RAG_SYSTEM.md` | Full RAG documentation |
| `docs/OLLAMA_SETUP.md` | Ollama setup guide |

---

## ✅ Benefits Summary

| Aspect | Benefit |
|--------|---------|
| **Privacy** | 100% local, no external API calls |
| **Cost** | $0 for AI (only infrastructure) |
| **Accuracy** | Context from YOUR docs, not generic |
| **Offline** | Works without internet |
| **Unlimited** | No rate limits or quotas |
| **Fast** | Vector search <100ms |

---

## 🎯 What Changed (Migration)

### ❌ Removed
- DeepSeek API integration
- Google Gemini API integration
- Multi-provider fallback logic
- Cloud API environment variables

### ✅ Added
- RAG service with Xenova embeddings
- Supabase pgvector integration
- Knowledge base indexer
- Context-aware AI responses

---

## 📚 Learn More

- [RAG System Documentation](./RAG_SYSTEM.md)
- [Ollama Setup Guide](./OLLAMA_SETUP.md)
- [Production Deployment](./PRODUCTION_DEPLOYMENT_OLLAMA.md)
- [Migration Summary](./RAG_MIGRATION_SUMMARY.md)

---

**Last Updated:** January 17, 2026  
**Architecture:** RAG + Ollama (100% Private)
