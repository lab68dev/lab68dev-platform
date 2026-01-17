# Ollama Local AI Setup

Run AI models locally on your machine with complete privacy and no API costs!

## Quick Start

### 1. Install Ollama

**Windows:**

- Download from [ollama.com](https://ollama.com/download/windows)
- Run the installer
- Ollama runs automatically as a service

**macOS:**

```bash
brew install ollama
```

**Linux:**

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### 2. Pull a Model

Open terminal/PowerShell and run:

```bash
# Recommended: DeepSeek R1 (7B - fast, good quality)
ollama pull deepseek-r1:7b

# Or other options:
ollama pull llama3.2          # Meta's Llama 3.2 (3B)
ollama pull mistral           # Mistral 7B
ollama pull qwen2.5:7b        # Qwen 2.5 (7B)
ollama pull codellama         # Code-focused model
```

### 3. Verify It's Running

```bash
# Check if Ollama is running
ollama list

# Test the model
ollama run deepseek-r1:7b
```

Type a message, then `/bye` to exit.

### 4. Configure Your App (Optional)

Add to `.env.local` to customize:

```env
# Optional - defaults shown below
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=deepseek-r1:7b
```

### 5. Start Using

That's it! Your AI Tools section will now:

1. ✅ Use Ollama local model (privacy-first, no cost)
2. 🧠 Enhanced with RAG (Retrieval-Augmented Generation) for context-aware responses
3. 📚 Answers based on your platform documentation and codebase

## Model Recommendations

### For Development/Coding

- **deepseek-r1:7b** - Best for code (7GB)
- **codellama** - Code-specialized (3.8GB)
- **qwen2.5-coder:7b** - Excellent for programming

### For General Chat

- **llama3.2** - Fast, lightweight (2GB)
- **mistral** - Good balance (4.1GB)

### For Advanced Tasks

- **deepseek-r1:32b** - More powerful (19GB, needs good GPU)
- **llama3.1:70b** - Highest quality (40GB, needs excellent GPU)

## System Requirements

- **Minimum:** 8GB RAM for 7B models
- **Recommended:** 16GB RAM + GPU (NVIDIA/AMD)
- **Storage:** 4-40GB depending on model size

## Troubleshooting

### "Ollama not available" message

1. Check if Ollama is running:

   ```bash
   ollama list
   ```

2. Restart Ollama service (Windows: Check system tray)
3. Verify model is downloaded:

   ```bash
   ollama pull deepseek-r1:7b
   ```

### Slow responses

- Use smaller models (3B-7B)
- Close other applications
- Consider upgrading RAM or adding GPU

### Port conflicts

If port 11434 is taken:

```bash
# Change Ollama port (Linux/Mac)
OLLAMA_HOST=0.0.0.0:11435 ollama serve
```

Then update `.env.local`:

```env
OLLAMA_URL=http://localhost:11435
```

## Benefits of Local AI + RAG

✅ **Privacy** - Your data never leaves your machine  
✅ **Cost** - No API fees  
✅ **Offline** - Works without internet  
✅ **Speed** - No network latency (with good hardware)  
✅ **Unlimited** - No rate limits or quotas  
✅ **Context-Aware** - RAG provides relevant documentation and code context  
✅ **Accurate** - Answers based on your actual platform, not generic knowledge
