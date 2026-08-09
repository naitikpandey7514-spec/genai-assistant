
import { useEffect, useState } from "react";
import "./App.css";


const API_URL =
  "https://genai-backend-kjin.onrender.com";


function App() {

  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([]);

  const [recentChats, setRecentChats] = useState([]);

  const [loading, setLoading] = useState(false);

  const [selectedMode, setSelectedMode] =
    useState("General");


  // =====================================================
  // LOAD HISTORY
  // =====================================================

  const loadHistory = async () => {

    try {

      const response = await fetch(
        `${API_URL}/history`
      );


      if (!response.ok) {

        throw new Error(
          `History error: ${response.status}`
        );

      }


      const data =
        await response.json();


      setRecentChats(
        Array.isArray(data)
          ? data.slice(0, 10)
          : []
      );


      console.log(
        "History loaded:",
        data.length
      );


    } catch (error) {

      console.error(
        "History error:",
        error
      );

    }

  };


  // =====================================================
  // LOAD HISTORY ON START
  // =====================================================

  useEffect(() => {

    loadHistory();

  }, []);


  // =====================================================
  // ASK AI
  // =====================================================

  const askAI = async () => {

    const currentQuestion =
      question.trim();


    if (
      !currentQuestion ||
      loading
    ) {

      return;

    }


    console.log(
      "QUESTION:",
      currentQuestion
    );


    console.log(
      "MODE:",
      selectedMode
    );


    // Show question

    setMessages(
      (previous) => [

        ...previous,

        {
          type: "user",
          text: currentQuestion
        }

      ]
    );


    // Clear input

    setQuestion("");


    // Show thinking

    setMessages(
      (previous) => [

        ...previous,

        {
          type: "ai",
          text: "Thinking...",
          temporary: true
        }

      ]
    );


    setLoading(true);


    try {

      const response =
        await fetch(
          `${API_URL}/ask`,
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json"

            },

            body: JSON.stringify({

              question:
                currentQuestion,

              mode:
                selectedMode

            })

          }
        );


      if (!response.ok) {

        throw new Error(
          `Server error: ${response.status}`
        );

      }


      const data =
        await response.json();


      console.log(
        "AI RESPONSE:",
        data
      );


      const answer =
        data.answer ||
        "Sorry, I could not generate a response.";


      setMessages(
        (previous) => {

          const updated =
            [...previous];


          const lastIndex =
            updated.length - 1;


          if (

            lastIndex >= 0 &&

            updated[lastIndex].type === "ai" &&

            updated[lastIndex].temporary

          ) {

            updated[lastIndex] = {

              type: "ai",

              text: answer

            };

          }


          return updated;

        }
      );


      loadHistory();


    } catch (error) {

      console.error(
        "ASK ERROR:",
        error
      );


      setMessages(
        (previous) => {

          const updated =
            [...previous];


          const lastIndex =
            updated.length - 1;


          if (

            lastIndex >= 0 &&

            updated[lastIndex].type === "ai" &&

            updated[lastIndex].temporary

          ) {

            updated[lastIndex] = {

              type: "ai",

              text:
                `❌ ${error.message}`

            };

          }


          return updated;

        }
      );


    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // GENERATE QUIZ
  // =====================================================

  const generateQuiz = async () => {

    const topic =
      question.trim();


    if (
      !topic ||
      loading
    ) {

      return;

    }


    console.log(
      "QUIZ BUTTON CLICKED"
    );


    console.log(
      "QUIZ TOPIC:",
      topic
    );


    // Show user message

    setMessages(
      (previous) => [

        ...previous,

        {

          type: "user",

          text:
            `📝 Generate quiz: ${topic}`

        },

        {

          type: "ai",

          text:
            "Creating your quiz...",

          temporary: true

        }

      ]
    );


    setQuestion("");

    setLoading(true);


    try {

      const response =
        await fetch(
          `${API_URL}/quiz`,
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json"

            },

            body: JSON.stringify({

              question: topic

            })

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


      const data =
        await response.json();


      console.log(
        "QUIZ RESPONSE:",
        data
      );


      const answer =
        data.answer ||
        "Sorry, I could not generate the quiz.";


      setMessages(
        (previous) => {

          const updated =
            [...previous];


          const lastIndex =
            updated.length - 1;


          if (

            lastIndex >= 0 &&

            updated[lastIndex].type === "ai" &&

            updated[lastIndex].temporary

          ) {

            updated[lastIndex] = {

              type: "ai",

              text: answer

            };

          }


          return updated;

        }
      );


    } catch (error) {

      console.error(
        "QUIZ ERROR:",
        error
      );


      setMessages(
        (previous) => {

          const updated =
            [...previous];


          const lastIndex =
            updated.length - 1;


          if (

            lastIndex >= 0 &&

            updated[lastIndex].type === "ai" &&

            updated[lastIndex].temporary

          ) {

            updated[lastIndex] = {

              type: "ai",

              text:
                `❌ ${error.message}`

            };

          }


          return updated;

        }
      );


    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // ENTER KEY
  // =====================================================

  const handleKeyDown =
    (event) => {

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

  };


  // =====================================================
  // OPEN HISTORY
  // =====================================================

  const openRecentChat =
    (chat) => {

      setMessages([

        {

          type: "user",

          text:
            chat.question

        },

        {

          type: "ai",

          text:
            chat.answer

        }

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

          🤖

          <span>
            GenAI
          </span>

        </div>


        <button
          type="button"
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


        <div className="sidebar-bottom">

          Powered by Gemini

        </div>


      </aside>


      {/* MAIN */}

      <section className="main">


        {/* HEADER */}

        <header className="header">

          <div>

            <h1>
              GenAI Assistant
            </h1>

            <p>

              Ask anything and get
              an AI-powered response.

            </p>

          </div>

        </header>


        {/* CHAT */}

        <main className="chat-box">


          {messages.length === 0 && (

            <div className="welcome">

              <div className="robot">
                🤖
              </div>

              <h2>
                How can I help you?
              </h2>

              <p>

                Ask me anything about
                programming, AI,
                technology and education.

              </p>

            </div>

          )}


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


        {/* AI MODES */}

        <div className="ai-modes">


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


        {/* INPUT */}

        <div className="input-box">


          <input
            type="text"
            value={question}
            onChange={(event) =>
              setQuestion(
                event.target.value
              )
            }
            onKeyDown={handleKeyDown}
            placeholder="Message GenAI..."
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
            title="Ask AI"
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


        <p className="disclaimer">

          GenAI can make mistakes.
          Check important information.

        </p>


      </section>

    </div>

  );

}


export default App;