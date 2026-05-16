# 🧪 Prompt Engineering Playground

An interactive web application to experiment with different prompt engineering techniques, compare outputs, and understand how LLM parameters affect responses.
---

## ✨ Features

### Core Features
- **Prompt Playground** - Write and test prompts with real-time LLM responses
- **Side-by-Side Comparison** - Compare two prompts or parameter configs simultaneously
- **Parameter Sweep** - Test same prompt across multiple temperature/top-p values
- **Prompt Library** - Save, organize, and reuse your best prompts
- **Execution History** - Track all runs with metrics and ratings
- **15+ Built-in Templates** - Pre-built templates across 5 categories
- **Dark/Light Theme** - Toggle between dark and light mode

### Prompt Engineering Techniques
| Technique | Description |
|-----------|-------------|
| Zero-Shot | Direct instruction without examples |
| Few-Shot | Provide examples before the task |
| Chain-of-Thought | Step-by-step reasoning |
| Role-Based | Assign persona to AI |
| Output Format | Control JSON, CSV, bullet output |
| Negative Prompting | Specify what NOT to do |

### LLM Parameters
- **Temperature** (0.0 - 2.0) - Controls creativity
- **Top-P** (0.0 - 1.0) - Nucleus sampling
- **Max Tokens** (50 - 4096) - Response length

---

## 🛠️ Tech Stack

### Backend
- Python 3.10+
- Flask + Flask-CORS
- SQLAlchemy + SQLite
- Groq API (llama-3.1-8b-instant)

### Frontend
- Next.js 14 (App Router)
- Tailwind CSS
- Responsive Design (Mobile + Desktop)

---

## 📁 Project Structure
prompt-playground/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── routes/
│   │   ├── generate.py
│   │   ├── prompts.py
│   │   ├── templates.py
│   │   └── history.py
│   ├── services/
│   │   └── llm_service.py
│   ├── models/
│   │   └── database.py
│   └── data/
│       └── templates.json
└── frontend/
└── src/
├── app/
│   ├── page.js
│   ├── compare/page.js
│   ├── sweep/page.js
│   ├── library/page.js
│   └── history/page.js
├── components/
│   └── Sidebar.js
└── lib/
└── api.js
---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API Key (free at console.groq.com)

### Backend Setup

```bash
# 1. Clone the repo
git clone https://github.com/abhishekverma0700/prompt-playground.git
cd prompt-playground

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate

# 3. Install dependencies
cd backend
pip install flask flask-cors flask-sqlalchemy python-dotenv requests

# 4. Setup environment variables
# Create .env file and add your Groq API key

# 5. Run backend
python app.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create `.env` file in root:
---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/generate | Send prompt to LLM |
| POST | /api/compare | Compare two prompts |
| POST | /api/sweep | Parameter sweep |
| GET | /api/templates | List all templates |
| GET | /api/templates/{id} | Get single template |
| POST | /api/prompts | Save a prompt |
| GET | /api/prompts | List saved prompts |
| PUT | /api/prompts/{id} | Update prompt |
| DELETE | /api/prompts/{id} | Delete prompt |
| GET | /api/history | Get execution history |
| PUT | /api/history/{id}/rate | Rate a response |
| POST | /api/export | Export prompts |
| POST | /api/import | Import prompts |
| GET | /api/health | Health check |

---

## 📋 Built-in Templates (15+)

| Category | Templates |
|----------|-----------|
| Content Writing | Blog Post Generator, Email Drafter, Social Media Post, Product Description |
| Code & Technical | Code Explainer, Bug Finder, Function Generator, API Documentation |
| Analysis & Reasoning | Pros & Cons Analysis, Sentiment Analyzer, Math Problem Solver |
| Summarization & Extraction | Text Summarizer, Entity Extractor |
| Translation & Language | Translator, Grammar Checker |

---

## 👨‍💻 Developer

**Abhishek Verma**
