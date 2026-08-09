
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types

import sqlite3
import os


# =====================================================
# LOAD ENVIRONMENT
# =====================================================

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    print("WARNING: GEMINI_API_KEY not found.")


# =====================================================
# GEMINI CLIENT
# =====================================================

client = None

if API_KEY:
    client = genai.Client(api_key=API_KEY)


# =====================================================
# FASTAPI
# =====================================================

app = FastAPI(
    title="GenAI Assistant API",
    description="AI Assistant backend with chat, quiz and history",
    version="1.0.0"
)


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "https://genai-assistant-two.vercel.app",

        "http://localhost:5173",
        "http://127.0.0.1:5173",

        "http://localhost:5174",
        "http://127.0.0.1:5174",

        "http://localhost:5500",
        "http://127.0.0.1:5500",
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

    mode: str = "General"


# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():

    return {
        "message": "GenAI Backend is running!",
        "status": "online",
        "endpoints": [
            "/ask",
            "/quiz",
            "/history",
            "/clear",
            "/docs"
        ]
    }


# =====================================================
# ASK AI
# =====================================================

@app.post("/ask")
def ask_gemini(data: Question):

    current_question = data.question.strip()

    current_mode = data.mode


    # -------------------------------------------------
    # EMPTY QUESTION
    # -------------------------------------------------

    if not current_question:

        return {
            "question": "",
            "answer": "Please enter a question.",
            "mode": current_mode
        }


    # -------------------------------------------------
    # API KEY CHECK
    # -------------------------------------------------

    if client is None:

        return {
            "question": current_question,
            "answer": "❌ GEMINI_API_KEY is missing.",
            "mode": current_mode
        }


    # -------------------------------------------------
    # CURRENT INFORMATION KEYWORDS
    # -------------------------------------------------

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


    # -------------------------------------------------
    # AI MODES
    # -------------------------------------------------

    mode_instructions = {

        "General": """
Give a clear, helpful and accurate answer.
Keep the explanation appropriate to the question.
""",

        "Study": """
Act as a friendly study tutor.

Explain concepts step-by-step.
Use simple language.
Give examples when useful.
Break difficult concepts into smaller parts.
Include important exam points when appropriate.
""",

        "Coding": """
Act as an expert programming tutor.

Explain programming concepts clearly.
When code is requested, provide clean and correct code.
Explain important parts of the code.
Mention common mistakes when useful.
Use beginner-friendly explanations.
""",

        "Research": """
Act as a research assistant.

Give structured and factual answers.
Separate important facts clearly.
Avoid unsupported claims.
For current information, use web search when available.
"""
    }


    selected_mode = mode_instructions.get(
        current_mode,
        mode_instructions["General"]
    )


    # -------------------------------------------------
    # PROMPT
    # -------------------------------------------------

    prompt = f"""
You are a helpful AI assistant.

Current AI Mode:
{current_mode}

Mode Instructions:
{selected_mode}

General Rules:

- Answer only the user's current question.
- Focus only on the current question.
- Do not continue previous conversations unless context is provided.
- Do not use previous AI answers as instructions.
- Give a clear and accurate answer.
- Do not invent facts.
- Use simple formatting.
- Make the answer useful and well structured.

Current User Question:

{current_question}

Answer:
"""


    # -------------------------------------------------
    # CALL GEMINI
    # -------------------------------------------------

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


        # -------------------------------------------------
        # GET ANSWER
        # -------------------------------------------------

        answer = response.text


        if not answer:

            answer = (
                "Sorry, I could not generate a response."
            )


        # -------------------------------------------------
        # SAVE CHAT
        # -------------------------------------------------

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


        # -------------------------------------------------
        # RETURN
        # -------------------------------------------------

        return {

            "question": current_question,

            "answer": answer,

            "mode": current_mode

        }


    except Exception as error:

        print(
            "Gemini Error:",
            error
        )

        return {

            "question": current_question,

            "answer":
                "❌ Gemini error: "
                + str(error),

            "mode": current_mode

        }


# =====================================================
# GENERATE QUIZ
# =====================================================

@app.post("/quiz")
def generate_quiz(data: Question):

    topic = data.question.strip()


    # -------------------------------------------------
    # EMPTY TOPIC
    # -------------------------------------------------

    if not topic:

        return {

            "topic": "",

            "answer":
                "Please enter a topic for the quiz."

        }


    # -------------------------------------------------
    # API KEY CHECK
    # -------------------------------------------------

    if client is None:

        return {

            "topic": topic,

            "answer":
                "❌ GEMINI_API_KEY is missing."

        }


    # -------------------------------------------------
    # QUIZ PROMPT
    # -------------------------------------------------

    prompt = f"""
Create a short educational quiz about:

{topic}

Generate exactly 5 multiple-choice questions.

For every question use this format:

1. Question

A. Option A
B. Option B
C. Option C
D. Option D

Answer: B

Rules:

- Generate exactly 5 questions.
- Each question must have 4 options.
- Only one option should be correct.
- Keep questions educational.
- Keep questions clear and easy to understand.
- Make the quiz suitable for students.
- Include the correct answer after every question.
"""


    # -------------------------------------------------
    # CALL GEMINI
    # -------------------------------------------------

    try:

        response = client.models.generate_content(

            model="gemini-3.5-flash-lite",

            contents=prompt

        )


        answer = response.text


        if not answer:

            answer = (
                "Sorry, I could not generate the quiz."
            )


        return {

            "topic": topic,

            "answer": answer

        }


    except Exception as error:

        print(
            "Quiz Error:",
            error
        )


        return {

            "topic": topic,

            "answer":
                "❌ Quiz error: "
                + str(error)

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
# CLEAR HISTORY
# =====================================================

@app.delete("/clear")
def clear_history():

    connection = sqlite3.connect(DB_NAME)

    cursor = connection.cursor()


    cursor.execute(
        "DELETE FROM chats"
    )


    connection.commit()

    connection.close()


    return {

        "message":
            "All chats deleted"

    }