
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOAD RECENT 10 CHATS
  // =====================================================

  const loadHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/history`);

      if (!response.ok) {
        throw new Error(`History error: ${response.status}`);
      }

      const data = await response.json();

      setRecentChats(Array.isArray(data) ? data.slice(0, 10) : []);

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

    // Show user's question immediately
    setMessages((previous) => [
      ...previous,
      {
        type: "user",
        text: currentQuestion,
      },
    ]);

    // Clear input
    setQuestion("");

    // Show thinking
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
      const response = await fetch("https://genai-backend-kjin.onrender.com/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      console.log("AI RESPONSE:", data);

      const answer =
        data.answer || "Sorry, I could not generate a response.";

      // Replace ONLY "Thinking..."
      // DO NOT clear previous messages
      setMessages((previous) => {
        const updated = [...previous];

        const lastIndex = updated.length - 1;

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

      // Refresh recent chats
      loadHistory();
    } catch (error) {
      console.error("ASK ERROR:", error);

      setMessages((previous) => {
        const updated = [...previous];

        const lastIndex = updated.length - 1;

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
    if (event.key === "Enter") {
      event.preventDefault();
      askAI();
    }
  };

  // =====================================================
  // NEW CHAT
  // =====================================================

  const newChat = () => {
    // Clears ONLY current screen.
    // Database/recent chats are NOT deleted.
    setMessages([]);
    setQuestion("");
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
  // UI
  // =====================================================

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="logo">
          🤖 <span>GenAI</span>
        </div>

        <button
          className="new-chat"
          onClick={newChat}
        >
          + New Chat
        </button>

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

            {recentChats.slice(0, 10).map((chat) => (
              <button
                className="history-item"
                key={chat.id}
                onClick={() => openRecentChat(chat)}
              >
                {chat.question}
              </button>
            ))}

          </div>

        </div>

        <div className="sidebar-bottom">
          Powered by Gemini
        </div>

      </aside>

      {/* MAIN */}
      <section className="main">

        {/* HEADER */}
        <header className="header">

          <div>
            <h1>GenAI Assistant</h1>

            <p>
              Ask anything and get an AI-powered response.
            </p>
          </div>

        </header>

        {/* CHAT */}
        <main className="chat-box">

          {/* WELCOME */}
          {messages.length === 0 && (
            <div className="welcome">

              <div className="robot">
                🤖
              </div>

              <h2>
                How can I help you?
              </h2>

              <p>
                Ask me anything about programming,
                AI, technology and education.
              </p>

            </div>
          )}

          {/* MESSAGES */}
          {messages.map((message, index) => (
            <div
              className={
                message.type === "user"
                  ? "message user"
                  : "message bot"
              }
              key={index}
            >

              <strong>
                {message.type === "user" ? "You" : "AI"}
              </strong>

              <p>
                {message.text}
              </p>

            </div>
          ))}

        </main>

        {/* INPUT */}
        <div className="input-container">

          <div className="input-box">

            <input
              type="text"
              value={question}
              onChange={(event) =>
                setQuestion(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Message GenAI..."
              autoComplete="off"
              disabled={loading}
            />

            <button
              onClick={askAI}
              disabled={loading || !question.trim()}
            >
              ➤
            </button>

          </div>

          <p className="disclaimer">
            GenAI can make mistakes. Check important information.
          </p>

        </div>

      </section>

    </div>
  );
}

export default App;