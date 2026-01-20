"""
Synthetic Dataset Generator for Lab68Dev AI Model

Generates training data for:
1. Task Creation - Structured tasks from natural language
2. Tech Q&A - Technical explanations and answers

Usage:
    python data/generate_dataset.py
"""

import json
import random
from pathlib import Path
from typing import List, Dict
from tqdm import tqdm


TASK_CATEGORIES = [
    "frontend", "backend", "database", "api", "testing", 
    "deployment", "documentation", "security", "performance", "devops"
]

TECH_STACKS = {
    "frontend": ["React", "Next.js", "Vue.js", "Angular", "Tailwind CSS", "TypeScript"],
    "backend": ["Node.js", "Python", "FastAPI", "Express", "Django", "NestJS"],
    "database": ["PostgreSQL", "MongoDB", "Redis", "Supabase", "Prisma", "MySQL"],
    "api": ["REST", "GraphQL", "tRPC", "WebSocket", "gRPC"],
    "testing": ["Jest", "Pytest", "Playwright", "Cypress", "Vitest"],
    "deployment": ["Docker", "Kubernetes", "Vercel", "AWS", "GitHub Actions"],
    "documentation": ["Markdown", "Storybook", "Swagger", "JSDoc"],
    "security": ["JWT", "OAuth", "HTTPS", "Encryption", "Auth0"],
    "performance": ["Caching", "CDN", "Lazy Loading", "Code Splitting"],
    "devops": ["CI/CD", "Monitoring", "Logging", "Infrastructure as Code"]
}

TASK_TEMPLATES = [
    {
        "input": "Create a task for building a {component} component in {tech}",
        "component": ["navbar", "login form", "dashboard", "sidebar", "modal", 
                     "card", "table", "pagination", "search bar", "dropdown menu"],
        "category": "frontend"
    },
    {
        "input": "I need to implement a {feature} feature for my web app",
        "feature": ["dark mode", "user authentication", "file upload", 
                   "real-time notifications", "infinite scroll", "drag and drop", 
                   "form validation", "responsive design"],
        "category": "frontend"
    },
    {
        "input": "Create a task for setting up a {service} with {tech}",
        "service": ["REST API", "authentication system", "payment integration", 
                   "email service", "cron job", "webhook handler"],
        "category": "backend"
    },
    {
        "input": "I need to build a {endpoint} endpoint that handles {action}",
        "endpoint": ["user", "product", "order", "notification", "report", "analytics"],
        "action": ["CRUD operations", "bulk updates", "file processing", 
                  "data export", "search and filtering"],
        "category": "backend"
    },
    {
        "input": "Create a task for designing a database schema for {domain}",
        "domain": ["e-commerce", "blog platform", "project management", 
                  "social media", "inventory system", "booking system"],
        "category": "database"
    },
    {
        "input": "I need to set up {action} for my project",
        "action": ["CI/CD pipeline", "Docker containerization", "automated testing", 
                  "monitoring and alerts", "staging environment"],
        "category": "devops"
    },
    {
        "input": "Create a development task for {action}",
        "action": ["refactoring the codebase", "improving test coverage", 
                  "optimizing performance", "fixing security vulnerabilities", 
                  "updating dependencies"],
        "category": "backend"
    }
]

TECH_QA_TEMPLATES = [
    {
        "question": "Explain how {concept} works in JavaScript",
        "concept": ["async/await", "closures", "prototypes", "event loop", "promises", 
                   "hoisting", "the this keyword", "arrow functions", "destructuring"],
        "category": "javascript"
    },
    {
        "question": "What is the difference between {a} and {b} in JavaScript?",
        "pairs": [("let", "const"), ("null", "undefined"), ("==", "==="),
                  ("map", "forEach"), ("call", "apply"), ("var", "let")],
        "category": "javascript"
    },
    {
        "question": "How do I implement {feature} in React?",
        "feature": ["state management", "side effects", "context API", "custom hooks",
                   "lazy loading", "error boundaries", "memoization", "portals"],
        "category": "react"
    },
    {
        "question": "What are the best practices for {topic} in React?",
        "topic": ["component composition", "performance optimization", "testing",
                 "folder structure", "state management", "handling forms"],
        "category": "react"
    },
    {
        "question": "How do I {action} in Node.js?",
        "action": ["handle errors", "set up middleware", "connect to a database",
                  "implement authentication", "handle file uploads", "set up logging"],
        "category": "backend"
    },
    {
        "question": "Explain the concept of {concept} in backend development",
        "concept": ["REST APIs", "middleware", "database indexing", "caching strategies",
                   "rate limiting", "microservices", "message queues"],
        "category": "backend"
    },
    {
        "question": "How do I optimize {operation} queries in SQL?",
        "operation": ["SELECT", "JOIN", "aggregation", "subquery", "bulk INSERT"],
        "category": "database"
    },
    {
        "question": "What is {concept} and why is it important?",
        "concept": ["version control", "CI/CD", "unit testing", "code review",
                   "agile methodology", "technical debt", "design patterns"],
        "category": "general"
    }
]

TECH_ANSWERS = {
    "async/await": """Async/await is syntactic sugar built on top of Promises.

**How it works:**
1. `async` marks a function as asynchronous
2. `await` pauses execution until the Promise resolves
3. Error handling uses try/catch blocks

**Example:**
```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}
```""",

    "closures": """A closure is a function with access to its outer scope variables.

**Example:**
```javascript
function createCounter() {
  let count = 0;
  return () => ++count;
}
const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

**Use cases:** Data privacy, factory functions, event handlers.""",

    "event loop": """The Event Loop handles async operations in JS.

**Components:**
1. Call Stack - executes sync code
2. Web APIs - handle async operations
3. Callback Queue - stores ready callbacks
4. Microtask Queue - for Promises

**Order:** Sync code -> Microtasks -> Macrotasks""",

    "state management": """React state management options:

**Local:** `useState(initialValue)`
**Complex:** `useReducer(reducer, initial)`
**Global:** Context API or Zustand/Redux

**Best practice:** Keep state as local as possible.""",

    "custom hooks": """Extract reusable stateful logic:

```javascript
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue];
}
```"""
}

SYSTEM_PROMPT = (
    "You are Lab68Dev Assistant, an AI specialized in software development "
    "tasks and technical explanations."
)


def extract_task_title(prompt: str) -> str:
    """Extract a title from the prompt."""
    prefixes = ["Create a task for ", "I need to ", "Build a ", "Set up ", "Implement "]
    title = prompt
    for prefix in prefixes:
        if title.lower().startswith(prefix.lower()):
            title = title[len(prefix):]
            break
    return title.strip().capitalize()


def generate_task_response(prompt: str, category: str) -> Dict:
    """Generate a structured task response."""
    tech_stack = random.sample(
        TECH_STACKS.get(category, TECH_STACKS["backend"]), 
        min(3, len(TECH_STACKS.get(category, [])))
    )
    
    steps = [
        "Research and understand requirements",
        "Set up development environment",
        "Implement core functionality",
        "Write unit tests",
        "Code review and refactoring",
        "Documentation and deployment"
    ]
    
    return {
        "title": extract_task_title(prompt),
        "description": f"Implementation task: {prompt}",
        "category": category,
        "priority": random.choice(["low", "medium", "high", "critical"]),
        "estimated_hours": random.choice([1, 2, 4, 8, 16, 24]),
        "tech_stack": tech_stack,
        "steps": [
            {"step": i + 1, "description": step, "status": "pending"} 
            for i, step in enumerate(random.sample(steps, random.randint(3, 5)))
        ],
        "acceptance_criteria": [
            "All functionality works as expected",
            "Unit tests pass with >80% coverage",
            "Code follows project style guidelines"
        ]
    }


def generate_tech_answer(question: str, concept: str = None) -> str:
    """Generate a technical answer."""
    if concept and concept in TECH_ANSWERS:
        return TECH_ANSWERS[concept]
    
    return f"""**Overview:** {question.replace('?', '')} is important in modern development.

**Key Points:**
1. Understanding fundamentals is crucial
2. Follow best practices for maintainability
3. Testing and documentation are essential

**Best Practices:**
- Write clean, readable code
- Follow established conventions
- Document your implementation"""


def generate_task_examples(num_examples: int = 2000) -> List[Dict]:
    """Generate task creation training examples."""
    examples = []
    
    for _ in range(num_examples):
        template = random.choice(TASK_TEMPLATES)
        prompt = template["input"]
        
        for key, values in template.items():
            if key not in ["input", "category"]:
                placeholder = "{" + key + "}"
                if placeholder in prompt:
                    prompt = prompt.replace(placeholder, random.choice(values))
        
        if "{tech}" in prompt:
            tech = random.choice(TECH_STACKS.get(template["category"], ["JavaScript"]))
            prompt = prompt.replace("{tech}", tech)
        
        response = generate_task_response(prompt, template["category"])
        
        examples.append({
            "instruction": prompt,
            "output": json.dumps(response, indent=2),
            "type": "task_creation"
        })
    
    return examples


def generate_qa_examples(num_examples: int = 2000) -> List[Dict]:
    """Generate tech Q&A training examples."""
    examples = []
    
    for _ in range(num_examples):
        template = random.choice(TECH_QA_TEMPLATES)
        question = template["question"]
        concept = None
        
        if "pairs" in template:
            pair = random.choice(template["pairs"])
            question = question.replace("{a}", pair[0]).replace("{b}", pair[1])
        else:
            for key, values in template.items():
                if key not in ["question", "category"]:
                    placeholder = "{" + key + "}"
                    if placeholder in question:
                        concept = random.choice(values)
                        question = question.replace(placeholder, concept)
        
        answer = generate_tech_answer(question, concept)
        
        examples.append({
            "instruction": question,
            "output": answer,
            "type": "tech_qa"
        })
    
    return examples


def format_for_training(examples: List[Dict]) -> List[Dict]:
    """Format examples for TinyLlama chat format."""
    formatted = []
    
    for ex in examples:
        text = (
            f"<|system|>\n{SYSTEM_PROMPT}</s>\n"
            f"
