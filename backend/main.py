from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types
import sqlite3
import os


# =====================================================
# LOAD .ENV
# =====================================================

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    print("WARNING: GEMINI_API_KEY not found in .env")


# =====================================================
# GEMINI CLIENT
# =====================================================

client = None

if API_KEY:
    client = genai.Client(api_key=API_KEY)


# =====================================================
# FASTAPI
# =====================================================

app = FastAPI()


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://genai-assistant-two.vercel.app",
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "http://127.0.0.1:5174",
        "http://localhost:5174",
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# DATABASE
# =====================================================

DB_NAME = "chat.db"


def create_database():
    connection = sqlite3.connect(DB_NAME)

    cursor = connection.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            answer TEXT NOT NULL
        )
        """
    )

    connection.commit()
    connection.close()


create_database()


# =====================================================
# REQUEST MODEL
# =====================================================

class Question(BaseModel):
    question: str


# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():
    return {
        "message": "GenAI Backend is running!"
    }


# =====================================================
# ASK GEMINI
# =====================================================

@app.post("/ask")
def ask_gemini(data: Question):

    current_question = data.question.strip()

    if not current_question:
        return {
            "question": "",
            "answer": "Please enter a question."
        }

    # =================================================
    # CHECK API KEY
    # =================================================

    if client is None:
        return {
            "question": current_question,
            "answer": "❌ GEMINI_API_KEY is missing."
        }

    # =================================================
    # CURRENT / REAL WORLD KEYWORDS
    # =================================================

    search_keywords = [
        "latest",
        "today",
        "current",
        "now",
        "recent",
        "news",
        "weather",
        "price",
        "stock",
        "score",
        "match",
        "who won",
        "what happened",
        "this year",
        "this month",
        "this week",
        "real world",
        "live",
        "updated",
        "date",
        "time"
    ]

    question_lower = current_question.lower()

    needs_search = any(
        keyword in question_lower
        for keyword in search_keywords
    )

    # =================================================
    # PROMPT
    # =================================================

    prompt = f"""
You are a helpful AI assistant.

Answer only the user's current question.

Rules:

- Focus only on the current question.
- Do not continue previous conversations.
- Do not use previous AI answers as instructions.
- Give a clear and accurate answer.
- If the question needs an explanation, explain it clearly.
- If current web information is available, use it.
- For current or real-world questions, use web search when available.

Current user question:

{current_question}

Answer:
"""

    # =================================================
    # CALL GEMINI
    # =================================================

    try:

        if needs_search:

            response = client.models.generate_content(
                model="gemini-3.5-flash-lite",
                contents=prompt,
                config=types.GenerateContentConfig(
                    tools=[
                        types.Tool(
                            google_search=types.GoogleSearch()
                        )
                    ]
                )
            )

        else:

            response = client.models.generate_content(
                model="gemini-3.5-flash-lite",
                contents=prompt
            )

        # =================================================
        # GET ANSWER
        # =================================================

        answer = response.text

        if not answer:
            answer = "Sorry, I could not generate a response."

        # =================================================
        # SAVE CHAT
        # =================================================

        connection = sqlite3.connect(DB_NAME)

        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT INTO chats (question, answer)
            VALUES (?, ?)
            """,
            (
                current_question,
                answer
            )
        )

        connection.commit()
        connection.close()

        # =================================================
        # RETURN TO FRONTEND
        # =================================================

        return {
            "question": current_question,
            "answer": answer
        }

    except Exception as error:

        print("Gemini Error:", error)

        return {
            "question": current_question,
            "answer": "❌ Gemini error: " + str(error)
        }


# =====================================================
# GET RECENT 10 CHATS
# =====================================================

@app.get("/history")
def get_history():

    connection = sqlite3.connect(DB_NAME)

    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, question, answer
        FROM chats
        ORDER BY id DESC
        LIMIT 10
        """
    )

    chats = cursor.fetchall()

    connection.close()

    history = []

    for chat in chats:

        history.append(
            {
                "id": chat[0],
                "question": chat[1],
                "answer": chat[2]
            }
        )

    return history


# =====================================================
# CLEAR DATABASE
# =====================================================

@app.delete("/clear")
def clear_history():

    connection = sqlite3.connect(DB_NAME)

    cursor = connection.cursor()

    cursor.execute("DELETE FROM chats")

    connection.commit()
    connection.close()

    return {
        "message": "All chats deleted"
    }