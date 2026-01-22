# AI Model Training Pipeline for Lab68Dev

Custom NLP model fine-tuned for task creation and tech support.

## Quick Start

### 1. Setup Environment

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Activate (Linux/macOS)
source venv/bin/activate
# Install dependencies
pip install -r requirements.txt
```

### 2. Generate Training Data

```bash
python data/generate_dataset.py
```

### 3. Train Model

```bash
python train.py
```

### 4. Run Inference Server

```bash
# Set allowed CORS origins (optional, defaults to http://localhost:3000)
export ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"

# Run the server
python inference/server.py
```

#### Environment Variables

- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins (default: `http://localhost:3000`)
  - Example: `http://localhost:3000,https://example.com`
  - For production, set this to your specific domain(s) for security

## Hardware Requirements

- **Minimum:** RTX 4060 (8GB VRAM)
- **Recommended:** RTX 4070+ (12GB+ VRAM)

## Model Details

- **Base Model:** TinyLlama-1.1B-Chat-v1.0
- **Fine-tuning:** LoRA (rank 16)
- **Dataset:** ~4000 synthetic examples (task creation + tech Q&A)
