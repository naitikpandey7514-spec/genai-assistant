
// =====================================================
// GENAI FRONTEND - COMPLETE SCRIPT
// =====================================================

console.log("🔥 GenAI SCRIPT LOADED 🔥");


// =====================================================
// API
// =====================================================

const API_URL = "http://127.0.0.1:8000";


// =====================================================
// ELEMENTS
// =====================================================

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("question");
const sendButton = document.getElementById("sendButton");

const historyList = document.getElementById("historyList");
const recentButton = document.getElementById("recentButton");
const recentArrow = document.getElementById("recentArrow");

const newChatButton = document.getElementById("newChatButton");
const themeButton = document.getElementById("themeButton");


// =====================================================
// SETTINGS
// =====================================================

const MAX_RECENT_CHATS = 10;


// =====================================================
// SAFETY CHECK
// =====================================================

console.log("chatBox:", chatBox);
console.log("input:", input);
console.log("sendButton:", sendButton);
console.log("historyList:", historyList);


// =====================================================
// ASK AI
// =====================================================

async function askAI() {

    const question = input.value.trim();

    if (question === "") {
        return;
    }

    console.log("=================================");
    console.log("QUESTION:", question);
    console.log(
        "Messages before request:",
        chatBox.querySelectorAll(".message").length
    );


    // =================================================
    // REMOVE ONLY WELCOME SCREEN
    // NEVER REMOVE EXISTING MESSAGES
    // =================================================

    const welcome = chatBox.querySelector(".welcome");

    if (welcome) {
        welcome.remove();
    }


    // =================================================
    // USER MESSAGE
    // =================================================

    const userMessage = document.createElement("div");

    userMessage.className = "message user";


    const userTitle = document.createElement("strong");

    userTitle.textContent = "You";


    const userText = document.createElement("p");

    userText.textContent = question;


    userMessage.appendChild(userTitle);
    userMessage.appendChild(userText);


    // IMPORTANT:
    // appendChild adds the new message.
    // It DOES NOT replace existing messages.

    chatBox.appendChild(userMessage);


    // =================================================
    // CLEAR INPUT ONLY
    // =================================================

    input.value = "";

    input.focus();


    // =================================================
    // AI MESSAGE
    // =================================================

    const aiMessage = document.createElement("div");

    aiMessage.className = "message bot";


    const aiTitle = document.createElement("strong");

    aiTitle.textContent = "AI";


    const aiText = document.createElement("p");

    aiText.textContent = "Thinking...";


    aiMessage.appendChild(aiTitle);
    aiMessage.appendChild(aiText);


    // IMPORTANT:
    // Append AI message.
    // Do NOT clear chatBox.

    chatBox.appendChild(aiMessage);


    // =================================================
    // SCROLL
    // =================================================

    chatBox.scrollTop = chatBox.scrollHeight;


    console.log(
        "Messages after adding question:",
        chatBox.querySelectorAll(".message").length
    );


    // =================================================
    // SEND REQUEST
    // =================================================

    try {

        console.log("Sending request to:", API_URL + "/ask");


        const response = await fetch(
            API_URL + "/ask",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                body: JSON.stringify({
                    question: question
                })
            }
        );


        console.log(
            "Backend status:",
            response.status
        );


        // =================================================
        // BACKEND ERROR
        // =================================================

        if (!response.ok) {

            let errorText = "";

            try {
                errorText = await response.text();
            } catch (e) {
                errorText = "";
            }


            throw new Error(
                "Backend error " +
                response.status +
                (errorText ? ": " + errorText : "")
            );
        }


        // =================================================
        // GET JSON
        // =================================================

        const data = await response.json();


        console.log("Backend response:", data);


        const answer =
            data.answer ||
            "Sorry, I did not receive an answer.";


        // =================================================
        // UPDATE ONLY THIS AI MESSAGE
        // =================================================

        aiText.textContent = answer;


        console.log(
            "Messages after AI response:",
            chatBox.querySelectorAll(".message").length
        );


        // =================================================
        // ADD TO RECENT CHATS
        //
        // IMPORTANT:
        // This function ONLY changes historyList.
        // It NEVER changes chatBox.
        // =================================================

        addRecentChat(
            question,
            answer
        );


        // =================================================
        // SCROLL AGAIN
        // =================================================

        chatBox.scrollTop = chatBox.scrollHeight;


        console.log(
            "Current conversation preserved."
        );


    } catch (error) {

        console.error(
            "ERROR:",
            error
        );


        // =================================================
        // SHOW ERROR IN THE EXISTING AI MESSAGE
        // DO NOT DELETE THE USER MESSAGE
        // =================================================

        aiText.textContent =
            "❌ " + error.message;


        chatBox.scrollTop =
            chatBox.scrollHeight;
    }


    console.log("=================================");
}


// =====================================================
// ADD RECENT CHAT
// =====================================================

function addRecentChat(question, answer) {

    if (!historyList) {
        return;
    }


    const item =
        document.createElement("button");


    item.type = "button";

    item.className = "history-item";


    item.textContent = question;


    item.title = question;


    item.addEventListener(
        "click",
        function () {

            showSavedChat(
                question,
                answer
            );

        }
    );


    // Newest at top

    historyList.prepend(item);


    // =================================================
    // KEEP ONLY 10 RECENT CHATS
    // =================================================

    while (
        historyList.children.length >
        MAX_RECENT_CHATS
    ) {

        historyList.removeChild(
            historyList.lastElementChild
        );

    }
}


// =====================================================
// LOAD DATABASE HISTORY
// =====================================================

async function loadHistory() {

    console.log("Loading history...");


    try {

        const response =
            await fetch(
                API_URL + "/history"
            );


        if (!response.ok) {

            throw new Error(
                "History request failed: " +
                response.status
            );

        }


        const history =
            await response.json();


        console.log(
            "History loaded:",
            history.length
        );


        // =================================================
        // IMPORTANT
        //
        // ONLY CLEAR THE SIDEBAR.
        //
        // NEVER TOUCH chatBox HERE.
        // =================================================

        if (!historyList) {
            return;
        }


        while (historyList.firstChild) {

            historyList.removeChild(
                historyList.firstChild
            );

        }


        // =================================================
        // ONLY FIRST 10
        // =================================================

        const recent =
            history.slice(
                0,
                MAX_RECENT_CHATS
            );


        recent.forEach(
            function (chat) {

                addRecentChat(
                    chat.question,
                    chat.answer
                );

            }
        );


        console.log(
            "Recent chats displayed:",
            historyList.children.length
        );


    } catch (error) {

        console.error(
            "History error:",
            error
        );

    }
}


// =====================================================
// SHOW SAVED CHAT
// =====================================================
//
// This is the ONLY normal operation that replaces
// the current chat screen.
//
// It happens when the user intentionally clicks
// a Recent Chat.
// =====================================================

function showSavedChat(
    question,
    answer
) {

    console.log(
        "Opening saved chat:",
        question
    );


    // =================================================
    // INTENTIONAL REPLACEMENT
    // =================================================

    while (chatBox.firstChild) {

        chatBox.removeChild(
            chatBox.firstChild
        );

    }


    // =================================================
    // USER MESSAGE
    // =================================================

    const userMessage =
        document.createElement("div");


    userMessage.className =
        "message user";


    const userTitle =
        document.createElement("strong");


    userTitle.textContent =
        "You";


    const userText =
        document.createElement("p");


    userText.textContent =
        question;


    userMessage.appendChild(
        userTitle
    );


    userMessage.appendChild(
        userText
    );


    chatBox.appendChild(
        userMessage
    );


    // =================================================
    // AI MESSAGE
    // =================================================

    const aiMessage =
        document.createElement("div");


    aiMessage.className =
        "message bot";


    const aiTitle =
        document.createElement("strong");


    aiTitle.textContent =
        "AI";


    const aiText =
        document.createElement("p");


    aiText.textContent =
        answer;


    aiMessage.appendChild(
        aiTitle
    );


    aiMessage.appendChild(
        aiText
    );


    chatBox.appendChild(
        aiMessage
    );


    // =================================================
    // SCROLL
    // =================================================

    chatBox.scrollTop =
        chatBox.scrollHeight;
}


// =====================================================
// RECENT CHAT OPEN / CLOSE
// =====================================================

function toggleHistory() {

    if (!historyList) {
        return;
    }


    const isOpen =
        historyList.classList.toggle(
            "show"
        );


    if (recentArrow) {

        recentArrow.textContent =
            isOpen
                ? "▾"
                : "▸";

    }
}


// =====================================================
// NEW CHAT
// =====================================================
//
// THIS is where the current conversation is cleared.
//
// Asking a question NEVER calls this function.
// Loading history NEVER calls this function.
// Receiving an AI response NEVER calls this function.
// =====================================================

function clearChat() {

    console.log(
        "NEW CHAT clicked - clearing current screen"
    );


    // =================================================
    // CLEAR CURRENT SCREEN
    // =================================================

    while (chatBox.firstChild) {

        chatBox.removeChild(
            chatBox.firstChild
        );

    }


    // =================================================
    // ADD WELCOME SCREEN
    // =================================================

    const welcome =
        document.createElement("div");


    welcome.className =
        "welcome";


    welcome.innerHTML = `
        <div class="robot">
            🤖
        </div>

        <h2>
            How can I help you?
        </h2>

        <p>
            Ask me anything about programming,
            AI, technology and education.
        </p>
    `;


    chatBox.appendChild(
        welcome
    );


    // =================================================
    // CLEAR INPUT
    // =================================================

    input.value = "";

    input.focus();
}


// =====================================================
// DARK MODE
// =====================================================

function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );

}


// =====================================================
// SEND BUTTON
// =====================================================

if (sendButton) {

    sendButton.addEventListener(
        "click",
        function () {

            askAI();

        }
    );

}


// =====================================================
// ENTER KEY
// =====================================================

if (input) {

    input.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                askAI();

            }

        }
    );

}


// =====================================================
// RECENT BUTTON
// =====================================================

if (recentButton) {

    recentButton.addEventListener(
        "click",
        function () {

            toggleHistory();

        }
    );

}


// =====================================================
// NEW CHAT BUTTON
// =====================================================

if (newChatButton) {

    newChatButton.addEventListener(
        "click",
        function () {

            clearChat();

        }
    );

}


// =====================================================
// THEME BUTTON
// =====================================================

if (themeButton) {

    themeButton.addEventListener(
        "click",
        function () {

            toggleTheme();

        }
    );

}


// =====================================================
// INITIAL LOAD
// =====================================================
//
// IMPORTANT:
//
// Loading Recent Chats does NOT touch chatBox.
//
// Therefore the current screen cannot disappear
// because of loadHistory().
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "DOM loaded."
        );


        loadHistory();

    }
);