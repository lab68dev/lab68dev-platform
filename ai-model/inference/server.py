#!/usr/bin/env python3
'''FastAPI Inference Server for Lab68Dev AI Model'''
import yaml
import torch
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

app = FastAPI(title='Lab68Dev AI API', version='1.0.0')
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])

model, tokenizer = None, None

class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: Optional[int] = 256
    temperature: Optional[float] = 0.7

class GenerateResponse(BaseModel):
    response: str
    prompt: str

def load_config():
    config_path = Path(__file__).parent.parent / 'config' / 'training_config.yaml'
    if config_path.exists():
        with open(config_path) as f: return yaml.safe_load(f)
    return {}

@app.on_event('startup')
async def startup():
    global model, tokenizer
    config = load_config()
    model_path = config.get('training', {}).get('output_dir', './models/lab68dev-assistant')
    base_model = config.get('model', {}).get('name', 'TinyLlama/TinyLlama-1.1B-Chat-v1.0')
    print('Loading model...')
    if Path(model_path).exists():
        tokenizer = AutoTokenizer.from_pretrained(model_path)
        model = AutoModelForCausalLM.from_pretrained(base_model, torch_dtype=torch.float16, device_map='auto')
        model = PeftModel.from_pretrained(model, model_path)
    else:
        tokenizer = AutoTokenizer.from_pretrained(base_model)
        model = AutoModelForCausalLM.from_pretrained(base_model, torch_dtype=torch.float16, device_map='auto')
    tokenizer.pad_token = tokenizer.eos_token
    model.eval()
    print('Model loaded!')

@app.get('/health')
async def health():
    return {'status': 'ok', 'model_loaded': model is not None}

@app.post('/generate', response_model=GenerateResponse)
async def generate(req: GenerateRequest):
    if model is None: raise HTTPException(503, 'Model not loaded')
    sys_prompt = 'You are Lab68Dev Assistant, an AI for software development.'
    # Build chat format
    sys_tag = chr(60) + '|system|' + chr(62)
    user_tag = chr(60) + '|user|' + chr(62)  
    asst_tag = chr(60) + '|assistant|' + chr(62)
    end_tag = chr(60) + '/s' + chr(62)
    nl = chr(10)
    full_prompt = sys_tag + nl + sys_prompt + end_tag + nl + user_tag + nl + req.prompt + end_tag + nl + asst_tag + nl
    inputs = tokenizer(full_prompt, return_tensors='pt').to(model.device)
    with torch.no_grad():
        outputs = model.generate(**inputs, max_new_tokens=req.max_tokens, temperature=req.temperature, do_sample=True, top_p=0.9, pad_token_id=tokenizer.eos_token_id)
    response = tokenizer.decode(outputs[0][len(inputs.input_ids[0]):], skip_special_tokens=True)
    return GenerateResponse(response=response.strip(), prompt=req.prompt)

@app.post('/create-task')
async def create_task(req: GenerateRequest):
    task_prompt = 'Create a structured task for: ' + req.prompt
    return await generate(GenerateRequest(prompt=task_prompt, max_tokens=req.max_tokens, temperature=0.3))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)