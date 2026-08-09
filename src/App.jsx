
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://genai-backend-kjin.onrender.com";

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState("General");

  // =====================================================
  // LOAD RECENT CHATS
  // =====================================================

  const loadHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/history`);

      if (!response.ok) {
        throw new Error(`History error: ${response.status}`);
      }

      const data = await response.json();

      setRecentChats(
        Array.isArray(data)
          ? data.slice(0, 10)
          : []
      );

      console.log("History loaded:", data.length);
    } catch (error) {
      console.error("History error:", error);
    }
  };

  // =====================================================
  // LOAD HISTORY WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    loadHistory();
  }, []);

  // =====================================================
  // ASK AI
  // =====================================================

  const askAI = async () => {
    const currentQuestion = question.trim();

    if (!currentQuestion || loading) {
      return;
    }

    console.log("QUESTION:", currentQuestion);
    console.log("MODE:", selectedMode);

    // Add user message
    setMessages((previous) => [
      ...previous,
      {
        type: "user",
        text: currentQuestion,
      },
    ]);

    // Clear input
    setQuestion("");

    // Add thinking message
    setMessages((previous) => [
      ...previous,
      {
        type: "ai",
        text: "Thinking...",
        temporary: true,
      },
    ]);

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/ask`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            question: currentQuestion,
            mode: selectedMode,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("AI RESPONSE:", data);

      const answer =
        data.answer ||
        "Sorry, I could not generate a response.";

      // Replace thinking message
      setMessages((previous) => {
        const updated = [...previous];

        const lastIndex =
          updated.length - 1;

        if (
          lastIndex >= 0 &&
          updated[lastIndex].type === "ai" &&
          updated[lastIndex].temporary
        ) {
          updated[lastIndex] = {
            type: "ai",
            text: answer,
          };
        }

        return updated;
      });

      // Refresh history
      loadHistory();

    } catch (error) {
      console.error("ASK ERROR:", error);

      setMessages((previous) => {
        const updated = [...previous];

        const lastIndex =
          updated.length - 1;

        if (
          lastIndex >= 0 &&
          updated[lastIndex].type === "ai" &&
          updated[lastIndex].temporary
        ) {
          updated[lastIndex] = {
            type: "ai",
            text: `❌ ${error.message}`,
          };
        }

        return updated;
      });

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GENERATE QUIZ
  // =====================================================

  const generateQuiz = async () => {
    const topic = question.trim();

    if (!topic || loading) {
      return;
    }

    console.log("QUIZ TOPIC:", topic);

    // Show user request
    setMessages((previous) => [
      ...previous,

      {
        type: "user",
        text: `📝 Generate quiz: ${topic}`,
      },

      {
        type: "ai",
        text: "Creating your quiz...",
        temporary: true,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/quiz`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            question: topic,
          }),
        }
      );

      console.log(
        "QUIZ STATUS:",
        response.status
      );

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("QUIZ RESPONSE:", data);

      const answer =
        data.answer ||
        "Sorry, I could not generate the quiz.";

      // Replace thinking message
      setMessages((previous) => {
        const updated = [...previous];

        const lastIndex =
          updated.length - 1;

        if (
          lastIndex >= 0 &&
          updated[lastIndex].type === "ai" &&
          updated[lastIndex].temporary
        ) {
          updated[lastIndex] = {
            type: "ai",
            text: answer,
          };
        }

        return updated;
      });

    } catch (error) {
      console.error("QUIZ ERROR:", error);

      setMessages((previous) => {
        const updated = [...previous];

        const lastIndex =
          updated.length - 1;

        if (
          lastIndex >= 0 &&
          updated[lastIndex].type === "ai" &&
          updated[lastIndex].temporary
        ) {
          updated[lastIndex] = {
            type: "ai",
            text: `❌ ${error.message}`,
          };
        }

        return updated;
      });

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ENTER KEY
  // =====================================================

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      askAI();
    }
  };

  // =====================================================
  // NEW CHAT
  // =====================================================

  const newChat = () => {
    setMessages([]);
    setQuestion("");
    setSelectedMode("General");
  };

  // =====================================================
  // OPEN RECENT CHAT
  // =====================================================

  const openRecentChat = (chat) => {
    setMessages([
      {
        type: "user",
        text: chat.question,
      },

      {
        type: "ai",
        text: chat.answer,
      },
    ]);
  };

  // =====================================================
  // FEATURE CARD - GENERAL
  // =====================================================

  const selectGeneral = () => {
    setSelectedMode("General");
  };

  // =====================================================
  // FEATURE CARD - STUDY
  // =====================================================

  const selectStudy = () => {
    setSelectedMode("Study");
  };

  // =====================================================
  // FEATURE CARD - CODING
  // =====================================================

  const selectCoding = () => {
    setSelectedMode("Coding");
  };

  // =====================================================
  // FEATURE CARD - QUIZ
  // =====================================================

  const selectQuiz = () => {
    setQuestion("Java loops");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="app">

      {/* =================================================
          SIDEBAR
          ================================================= */}

      <aside className="sidebar">

        {/* LOGO */}

        <div className="logo">
          🤖 <span>NikAI</span>
        </div>


        {/* NEW CHAT */}

        <button
          type="button"
          className="new-chat"
          onClick={newChat}
        >
          + New Chat
        </button>


        {/* RECENT CHATS */}

        <div className="recent-section">

          <div className="recent-title">
            Recent Chats
          </div>


          <div className="history-list">

            {recentChats.length === 0 && (
              <p className="no-history">
                No recent chats
              </p>
            )}


            {recentChats
              .slice(0, 10)
              .map((chat) => (
                <button
                  type="button"
                  className="history-item"
                  key={chat.id}
                  onClick={() =>
                    openRecentChat(chat)
                  }
                >
                  {chat.question}
                </button>
              ))}

          </div>

        </div>


        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">
          Powered by Gemini
        </div>

      </aside>


      {/* =================================================
          MAIN
          ================================================= */}

      <section className="main">


        {/* HEADER */}

        <header className="header">

          <div>

            <h1>
              NikAI Assistant
            </h1>

            <p>
              Ask anything and get an
              AI-powered response.
            </p>

          </div>

        </header>


        {/* =================================================
            CHAT AREA
            ================================================= */}

        <main className="chat-box">


          {/* =================================================
              WELCOME SCREEN
              ================================================= */}

          {messages.length === 0 && (

            <div className="welcome">

              {/* ROBOT */}

              <div className="welcome-icon">
                🤖
              </div>


              {/* TITLE */}

              <h2>
                Welcome to <span>NikAI</span>
              </h2>


              {/* DESCRIPTION */}

              <p className="welcome-subtitle">
                Your intelligent AI assistant
                for learning, coding,
                research and more.
              </p>


              {/* =================================================
                  FEATURE CARDS
                  ================================================= */}

              <div className="feature-grid">


                {/* GENERAL AI */}

                <button
                  type="button"
                  onClick={selectGeneral}
                  className="feature-card"
                >

                  <div className="feature-icon">
                    🤖
                  </div>

                  <strong>
                    General AI
                  </strong>

                  <span>
                    Ask anything and get
                    helpful answers.
                  </span>

                </button>


                {/* STUDY */}

                <button
                  type="button"
                  onClick={selectStudy}
                  className="feature-card"
                >

                  <div className="feature-icon">
                    📚
                  </div>

                  <strong>
                    Study Assistant
                  </strong>

                  <span>
                    Learn concepts with
                    simple explanations.
                  </span>

                </button>


                {/* CODING */}

                <button
                  type="button"
                  onClick={selectCoding}
                  className="feature-card"
                >

                  <div className="feature-icon">
                    💻
                  </div>

                  <strong>
                    Coding Helper
                  </strong>

                  <span>
                    Understand code and
                    solve programming problems.
                  </span>

                </button>


                {/* QUIZ */}

                <button
                  type="button"
                  onClick={selectQuiz}
                  className="feature-card"
                >

                  <div className="feature-icon">
                    📝
                  </div>

                  <strong>
                    Quiz Generator
                  </strong>

                  <span>
                    Generate a quiz from
                    any topic.
                  </span>

                </button>


              </div>

            </div>

          )}


          {/* =================================================
              MESSAGES
              ================================================= */}

          {messages.map(
            (message, index) => (

              <div
                className={
                  message.type === "user"
                    ? "message user"
                    : "message bot"
                }
                key={index}
              >

                <strong>

                  {message.type === "user"
                    ? "You"
                    : "AI"}

                </strong>


                <p>
                  {message.text}
                </p>

              </div>

            )
          )}

        </main>


        {/* =================================================
            AI MODES
            ================================================= */}

        <div className="ai-modes">


          {/* GENERAL */}

          <button
            type="button"
            onClick={() =>
              setSelectedMode("General")
            }
            className={
              selectedMode === "General"
                ? "active"
                : ""
            }
          >
            🤖 General
          </button>


          {/* STUDY */}

          <button
            type="button"
            onClick={() =>
              setSelectedMode("Study")
            }
            className={
              selectedMode === "Study"
                ? "active"
                : ""
            }
          >
            📚 Study
          </button>


          {/* CODING */}

          <button
            type="button"
            onClick={() =>
              setSelectedMode("Coding")
            }
            className={
              selectedMode === "Coding"
                ? "active"
                : ""
            }
          >
            💻 Coding
          </button>


          {/* RESEARCH */}

          <button
            type="button"
            onClick={() =>
              setSelectedMode("Research")
            }
            className={
              selectedMode === "Research"
                ? "active"
                : ""
            }
          >
            🔎 Research
          </button>

        </div>


        {/* =================================================
            INPUT AREA
            ================================================= */}

        <div className="input-box">


          {/* TEXT INPUT */}

          <input
            type="text"
            value={question}
            onChange={(event) =>
              setQuestion(
                event.target.value
              )
            }
            onKeyDown={handleKeyDown}
            placeholder="Message NikAI..."
            autoComplete="off"
            disabled={loading}
          />


          {/* ASK BUTTON */}

          <button
            type="button"
            onClick={askAI}
            disabled={
              loading ||
              !question.trim()
            }
            title="Ask NikAI"
          >
            ➤
          </button>


          {/* QUIZ BUTTON */}

          <button
            type="button"
            onClick={generateQuiz}
            disabled={
              loading ||
              !question.trim()
            }
            title="Generate Quiz"
          >
            📝
          </button>

        </div>


        {/* DISCLAIMER */}

        <p className="disclaimer">
          NikAI can make mistakes.
          Check important information.
        </p>


      </section>

    </div>
  );
}

export default App;
