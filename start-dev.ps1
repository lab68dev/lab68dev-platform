# Lab68 Dev Platform - Development Startup Script
# This script ensures Ollama is available and starts the dev server

Write-Host "🚀 Starting Lab68 Dev Platform..." -ForegroundColor Cyan
Write-Host ""

# Add Ollama to PATH
$env:PATH = "C:\Users\$env:USERNAME\AppData\Local\Programs\Ollama;$env:PATH"

# Check if Ollama is running
Write-Host "Checking Ollama status..." -ForegroundColor Yellow
try {
    $ollamaVersion = ollama --version 2>$null
    Write-Host "✓ Ollama installed: $ollamaVersion" -ForegroundColor Green
    
    $models = ollama list 2>$null
    if ($models -match "deepseek-r1:7b") {
        Write-Host "✓ DeepSeek R1 7B model ready" -ForegroundColor Green
        Write-Host "🟢 AI will run locally (privacy-first, no API costs)" -ForegroundColor Green
    } else {
        Write-Host "⚠ DeepSeek model not found. Run: ollama pull deepseek-r1:7b" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠ Ollama not found. AI will use fallback APIs" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Cyan
Write-Host ""

# Start the dev server
pnpm dev
