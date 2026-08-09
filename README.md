# 🤖 NikAI

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=28&pause=1000&color=36BCF7&center=true&vCenter=true&width=750&lines=Welcome+to+NikAI+%F0%9F%A4%96;Your+AI+Learning+%26+Productivity+Assistant;Learn+%7C+Code+%7C+Research+%7C+Create;Powered+by+React+%2B+FastAPI+%2B+Gemini" alt="Typing SVG" />
</p>

<p align="center">
  <b>🚀 Learn. Code. Research. Create. — All with NikAI.</b>
</p>

<p align="center">
  <a href="https://genai-assistant-two.vercel.app/">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-NikAI-36BCF7?style=for-the-badge" />
  </a>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" />
</p>

---

## 🧠 What is NikAI?

**NikAI** is a full-stack AI assistant built to make **learning, coding, research, and everyday productivity easier**.

Powered by **Google Gemini**, NikAI provides an interactive AI experience through a modern **React frontend**, secure **FastAPI backend**, and **SQLite database**.

Whether you want to understand a difficult concept, debug code, research a topic, or generate a quiz, NikAI brings these capabilities together in one simple platform.

```text
╔══════════════════════════════════════════════╗
║                  🤖 NikAI                   ║
║                                              ║
║     📚 Learn     💻 Code     🔎 Research    ║
║                                              ║
║             ✨ Powered by AI ✨              ║
╚══════════════════════════════════════════════╝
```

---

## 🌐 Live Demo

🚀 **Try NikAI:**

https://genai-assistant-two.vercel.app/

---

## ✨ Key Features

### 🤖 General AI

Ask questions on everyday topics and receive intelligent AI-generated responses.

### 📚 Study Mode

Understand difficult concepts through simple, structured, and easy-to-follow explanations.

### 💻 Coding Mode

Get assistance with:

* Programming concepts
* Code explanations
* Debugging
* Syntax
* Programming examples
* Problem solving

### 🔎 Research Mode

Explore different topics and receive structured information to help with research and learning.

### 📝 Quiz Generator

Generate quizzes from any topic to test your knowledge and improve understanding.

### 💬 Chat History

Access previous conversations and continue discussions without starting from scratch.

### 📱 Responsive UI

NikAI is designed to work across:

* 💻 Desktop
* 📱 Mobile
* 🖥️ Different screen sizes

### 🔐 Secure Backend

The Gemini API key is handled by the backend instead of being exposed directly in the frontend.

---

## 🛠️ Technology Stack

| Layer                  | Technology        |
| ---------------------- | ----------------- |
| 🎨 Frontend            | React.js          |
| ⚡ Build Tool           | Vite              |
| 🎨 Styling             | CSS               |
| 🐍 Backend             | FastAPI           |
| 💻 Language            | Python            |
| 🗄️ Database           | SQLite            |
| 🧠 AI                  | Google Gemini API |
| ☁️ Frontend Deployment | Vercel            |
| ☁️ Backend Deployment  | Render            |

---

## 🏗️ System Architecture

```text
                    ┌──────────────────┐
                    │      👤 User     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  NikAI Frontend  │
                    │   React + Vite   │
                    └────────┬─────────┘
                             │
                       HTTP Request
                             │
                             ▼
                    ┌──────────────────┐
                    │ FastAPI Backend  │
                    │     Python       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Google Gemini  │
                    │       AI         │
                    └────────┬─────────┘
                             │
                       AI Response
                             │
                             ▼
                    ┌──────────────────┐
                    │  NikAI Interface │
                    └──────────────────┘
```

---

## 🔄 How NikAI Works

```text
User Input
     ↓
Select AI Mode
     ↓
React Frontend
     ↓
FastAPI API
     ↓
Gemini AI Processing
     ↓
Generated Response
     ↓
React Interface
     ↓
Chat History
```

---

## 📂 Project Structure

```text
NikAI/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── main.py
│   ├── chat.db
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

# 🚀 Getting Started

Follow the steps below to run NikAI locally.

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/naitikpandey7514-spec/NikAI.git
cd NikAI
```

> If your actual repository name is different, replace the URL with your repository URL.

---

# 🎨 Frontend Setup

Go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

# 🐍 Backend Setup

Open another terminal.

Go to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

### Windows

Activate the virtual environment:

```bash
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend` directory:

```env
GEMINI_API_KEY=your_gemini_api_key
```

⚠️ **Never upload your API key to GitHub.**

Add the following to `.gitignore`:

```text
.env
venv/
__pycache__/
*.pyc
```

---

## ▶️ Run the Backend

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will normally run at:

```text
http://127.0.0.1:8000
```

FastAPI automatically provides interactive API documentation at:

```text
http://127.0.0.1:8000/docs
```

---

# 🔌 API Flow

The frontend sends the user's question to the FastAPI backend.

```text
POST /ask
     ↓
FastAPI receives request
     ↓
Gemini API processes question
     ↓
AI generates response
     ↓
FastAPI returns response
     ↓
React displays response
```

### Example Request

```json
{
  "message": "What is Python?"
}
```

### Example Response

```json
{
  "response": "Python is a high-level programming language..."
}
```

---

# ☁️ Deployment

## 🎨 Frontend — Vercel

The React frontend is deployed using **Vercel**.

## 🐍 Backend — Render

The FastAPI backend is deployed using **Render**.

### Deployment Architecture

```text
                    🌐 Internet
                         │
                         ▼
                ┌─────────────────┐
                │     Vercel      │
                │ React Frontend  │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │     Render      │
                │ FastAPI Backend │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Google Gemini   │
                │      API        │
                └─────────────────┘
```

---

# 🔐 Security

NikAI uses a backend-based API architecture to keep the Gemini API key away from the public frontend.

### Security Practices

* 🔒 API key stored in environment variables
* 🚫 `.env` excluded from Git
* 🛡️ AI requests handled through the backend
* 🔑 No API key hardcoded in frontend source code
* 🔐 Backend controls communication with Gemini

---

# 📊 Project Highlights

| Area                | Implementation           |
| ------------------- | ------------------------ |
| 🤖 AI Assistant     | Google Gemini            |
| 🎨 Frontend         | React + Vite             |
| 🐍 Backend          | FastAPI                  |
| 🗄️ Database        | SQLite                   |
| 🔌 API              | REST API                 |
| ☁️ Frontend Hosting | Vercel                   |
| ☁️ Backend Hosting  | Render                   |
| 🔐 Security         | Backend API Key Handling |
| 🎯 Target Users     | Students & General Users |

---

# 🔮 Future Scope

NikAI can be expanded with several advanced capabilities:

* 🎙️ **Voice Interaction**
* 📄 **PDF & Document Analysis**
* 🖼️ **Image Understanding**
* 🧠 **Personalized AI Memory**
* 🔐 **User Authentication**
* 📊 **Learning Progress Tracking**
* 📱 **Mobile Application**
* 🌍 **Multi-Language Support**
* 🔌 **Browser Extension**
* 📚 **Personalized Study Plans**
* 💡 **AI-Powered Project Assistance**

---

# 🎯 Project Goal

The goal of **NikAI** is to bring multiple AI-powered capabilities into one simple platform.

```text
              📚 Learning
                   │
                   ▼
              💻 Coding
                   │
                   ▼
              🔎 Research
                   │
                   ▼
             📝 Productivity
                   │
                   ▼
                🤖 NikAI
```

Instead of using different tools for different tasks, NikAI aims to provide a **simple, accessible, and intelligent AI workspace** for students and everyday users.

---

# 👨‍💻 Developer

## Naitik Pandey

**B.Tech — Artificial Intelligence & Machine Learning**

### Interests

* 🤖 Artificial Intelligence
* 🧠 Machine Learning
* 💻 Programming
* 🌐 Web Development
* 📊 Data & Technology

### GitHub

https://github.com/naitikpandey7514-spec

---

# 📜 License

This project is developed for **educational, learning, and hackathon purposes**.

---

# ⭐ Support

If you find **NikAI** useful or interesting, consider giving the project a ⭐ on GitHub.

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&pause=1000&color=36BCF7&center=true&vCenter=true&width=650&lines=Thanks+for+visiting+NikAI+%F0%9F%91%8B;Keep+Learning+%7C+Keep+Building+%7C+Keep+Innovating+%F0%9F%9A%80" alt="Typing SVG" />
</p>

<p align="center">
  <b>Built with ❤️ using React, FastAPI & Google Gemini</b>
</p>
```
