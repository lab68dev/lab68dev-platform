#!/usr/bin/env python3
"""
Training Script for Lab68Dev AI Model
Fine-tunes TinyLlama using LoRA for task creation and tech Q&A.
"""

import yaml
import torch
from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    BitsAndBytesConfig,
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from trl import SFTTrainer


def load_config(config_path: str = "config/training_config.yaml") -> dict:
    """Load training configuration."""
    try:
        with open(config_path, "r") as f:
            return yaml.safe_load(f)
    except OSError as e:
        # Handle file-related errors (missing file, permission issues, etc.)
        raise RuntimeError(f"Failed to read configuration file '{config_path}': {e}") from e
    except yaml.YAMLError as e:
        # Handle malformed or invalid YAML content
        raise RuntimeError(f"Failed to parse YAML configuration from '{config_path}': {e}") from e


def setup_model_and_tokenizer(config: dict):
    """Setup model with 4-bit quantization and LoRA."""
    model_name = config["model"]["name"]
    
    # Quantization config for 4-bit loading
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.float16,
        bnb_4bit_use_double_quant=True,
    )
    
    # Load tokenizer
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "right"
    
    # Load model with quantization
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        quantization_config=bnb_config,
        device_map="auto",
        trust_remote_code=True,
    )
    
    # Prepare for k-bit training
    model = prepare_model_for_kbit_training(model)
    
    # LoRA configuration
    lora_config = LoraConfig(
        r=config["lora"]["r"],
        lora_alpha=config["lora"]["lora_alpha"],
        lora_dropout=config["lora"]["lora_dropout"],
        target_modules=config["lora"]["target_modules"],
        bias="none",
        task_type="CAUSAL_LM",
    )
    
    # Apply LoRA
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()
    
    return model, tokenizer


def load_training_data(config: dict):
    """Load training and validation datasets."""
    data_files = {
        "train": config["dataset"]["train_file"],
        "validation": config["dataset"]["val_file"],
    }
    
    dataset = load_dataset("json", data_files=data_files)
    return dataset


def train(config: dict):
    """Main training function."""
    print("=" * 50)
    print("Lab68Dev AI Model Training")
    print("=" * 50)
    
    # Setup
    print("\n[1/4] Loading model and tokenizer...")
    model, tokenizer = setup_model_and_tokenizer(config)
    
    print("\n[2/4] Loading training data...")
    dataset = load_training_data(config)
    print(f"  Train samples: {len(dataset['train'])}")
    print(f"  Val samples: {len(dataset['validation'])}")
    
    print("\n[3/4] Setting up trainer...")
    training_args = TrainingArguments(
        output_dir=config["training"]["output_dir"],
        num_train_epochs=config["training"]["num_train_epochs"],
        per_device_train_batch_size=config["training"]["per_device_train_batch_size"],
        gradient_accumulation_steps=config["training"]["gradient_accumulation_steps"],
        learning_rate=config["training"]["learning_rate"],
        weight_decay=config["training"]["weight_decay"],
        warmup_ratio=config["training"]["warmup_ratio"],
        lr_scheduler_type=config["training"]["lr_scheduler_type"],
        logging_steps=config["training"]["logging_steps"],
        save_steps=config["training"]["save_steps"],
        eval_steps=config["training"]["eval_steps"],
        save_total_limit=config["training"]["save_total_limit"],
        fp16=config["training"]["fp16"],
        optim=config["training"]["optim"],
        evaluation_strategy="steps",
        load_best_model_at_end=True,
        report_to="none",
    )
    
    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=dataset["train"],
        eval_dataset=dataset["validation"],
        dataset_text_field="text",
        max_seq_length=config["model"]["max_length"],
        args=training_args,
    )
    
    print("\n[4/4] Starting training...")
    trainer.train()
    
    # Save the final model
    print("\nSaving model...")
    trainer.save_model(config["training"]["output_dir"])
    tokenizer.save_pretrained(config["training"]["output_dir"])
    
    print("\n" + "=" * 50)
    print("Training complete!")
    print(f"Model saved to: {config['training']['output_dir']}")
    print("=" * 50)


def main():
    config = load_config()
    train(config)


if __name__ == "__main__":
    main()
