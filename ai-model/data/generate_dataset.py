#!/usr/bin/env python3
"""Dataset Generator for Lab68Dev AI Model"""
import json
import random
from pathlib import Path
from typing import List, Dict

TECH_STACKS = {
    "frontend": ["React", "Next.js", "Vue.js", "TypeScript", "Tailwind"],
    "backend": ["Node.js", "Python", "FastAPI", "Express", "Django"],
    "database": ["PostgreSQL", "MongoDB", "Redis", "Supabase"],
    "devops": ["Docker", "AWS", "GitHub Actions", "Kubernetes"]
}

TASK_PROMPTS = [
    ("Create a task for building a navbar in React", "frontend"),
    ("Create a task for building a login form", "frontend"),
    ("I need to implement dark mode for my app", "frontend"),
    ("Create a task for setting up a REST API", "backend"),
    ("I need to build a user authentication system", "backend"),
    ("Create a task for database schema design", "database"),
    ("I need to set up CI/CD pipeline", "devops"),
    ("Create a task for Docker containerization", "devops"),
]

QA_PAIRS = [
    ("Explain async/await in JavaScript", "Async/await is syntactic sugar for Promises. The async keyword marks a function as asynchronous, and await pauses execution until the Promise resolves. Use try/catch for error handling."),
    ("Explain closures in JavaScript", "A closure is a function that has access to variables from its outer scope, even after the outer function has returned. Common uses include data privacy and factory functions."),
    ("How to implement state management in React?", "Options include: useState for local state, useReducer for complex state, Context API for global state, or external libraries like Zustand or Redux for large applications."),
    ("How to handle errors in Node.js?", "Use try/catch blocks for async/await. Create custom error classes. Implement error middleware in Express. Always log errors with proper context."),
    ("Explain REST APIs", "REST uses HTTP methods (GET, POST, PUT, DELETE) for CRUD operations. Resources are identified by URLs. The architecture is stateless and uses proper status codes."),
    ("What is the difference between let and const?", "Both are block-scoped. let allows reassignment while const does not. Use const by default and let only when you need to reassign the variable."),
    ("How to optimize database queries?", "Use indexes on frequently queried columns. Select only needed columns. Use EXPLAIN to analyze query plans. Implement pagination for large datasets."),
]

SYSTEM_PROMPT = "You are Lab68Dev Assistant, an AI specialized in software development tasks and technical explanations."


def extract_title(prompt: str) -> str:
    """Extract task title from prompt."""
    for prefix in ["Create a task for ", "I need to "]:
        if prompt.startswith(prefix):
            return prompt[len(prefix):].capitalize()
    return prompt.capitalize()


def generate_task(prompt: str, category: str) -> Dict:
    """Generate structured task response."""
    tech = TECH_STACKS.get(category, ["JavaScript"])
    return {
        "title": extract_title(prompt),
        "category": category,
        "priority": random.choice(["low", "medium", "high"]),
        "estimated_hours": random.choice([2, 4, 8, 16]),
        "tech_stack": random.sample(tech, min(2, len(tech))),
        "steps": [
            {"step": 1, "description": "Research requirements", "status": "pending"},
            {"step": 2, "description": "Implement core functionality", "status": "pending"},
            {"step": 3, "description": "Write tests", "status": "pending"},
            {"step": 4, "description": "Review and deploy", "status": "pending"},
        ]
    }


def generate_examples(num_tasks: int = 2000, num_qa: int = 2000) -> List[Dict]:
    """Generate training examples."""
    examples = []
    
    # Task creation examples
    for _ in range(num_tasks):
        prompt, category = random.choice(TASK_PROMPTS)
        task = generate_task(prompt, category)
        examples.append({
            "instruction": prompt,
            "output": json.dumps(task, indent=2),
            "type": "task_creation"
        })
    
    # Q&A examples
    for _ in range(num_qa):
        question, answer = random.choice(QA_PAIRS)
        examples.append({
            "instruction": question,
            "output": answer,
            "type": "tech_qa"
        })
    
    random.shuffle(examples)
    return examples


def format_for_training(examples: List[Dict]) -> List[Dict]:
    """Format examples for TinyLlama chat format."""
    # Define tags using chr() to avoid parsing issues
    sys_open = chr(60) + "|system|" + chr(62)
    user_open = chr(60) + "|user|" + chr(62)
    asst_open = chr(60) + "|assistant|" + chr(62)
    end_tag = chr(60) + "/s" + chr(62)
    newline = chr(10)
    
    formatted = []
    for ex in examples:
        text = sys_open + newline + SYSTEM_PROMPT + end_tag + newline
        text += user_open + newline + ex["instruction"] + end_tag + newline
        text += asst_open + newline + ex["output"] + end_tag
        formatted.append({"text": text})
    
    return formatted


def main():
    print("Generating synthetic dataset...")
    
    # Create output directory
    output_dir = Path("data/dataset")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate examples
    examples = generate_examples(2000, 2000)
    
    # Split into train/val
    split_idx = int(len(examples) * 0.9)
    train_examples = format_for_training(examples[:split_idx])
    val_examples = format_for_training(examples[split_idx:])
    
    # Save to JSONL files
    with open(output_dir / "train.jsonl", "w", encoding="utf-8") as f:
        for ex in train_examples:
            f.write(json.dumps(ex, ensure_ascii=False) + "\n")
    
    with open(output_dir / "val.jsonl", "w", encoding="utf-8") as f:
        for ex in val_examples:
            f.write(json.dumps(ex, ensure_ascii=False) + "\n")
    
    print(f"Generated {len(train_examples)} training examples")
    print(f"Generated {len(val_examples)} validation examples")
    print(f"Saved to {output_dir}")


if __name__ == "__main__":
    main()
