import "./style.css";

import {
    addUserMessage,
    addAssistantMessage,
    getInputValue,
    clearInput,
    showThinkingIndicator,
    removeThinkingIndicator
} from "./ui";

import { sendMessage } from "./api";
const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
    throw new Error("App element not found");
}

app.innerHTML = `
    <main class="chat-app">

        <header class="chat-header">
            <h1>Wonka AI Assistant</h1>
        </header>

        <section class="chat-messages" id="chat-messages">

            <div class="message assistant-message">

                <div class="message-icon assistant-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                        <rect x="5" y="6" width="14" height="13" rx="4"></rect>
                        <path d="M9 11h.01"></path>
                        <path d="M15 11h.01"></path>
                        <path d="M9 15c1.5 1 4.5 1 6 0"></path>
                        <path d="M12 6V3"></path>
                        <circle cx="12" cy="2.5" r=".5"></circle>
                    </svg>
                </div>

                <div class="message-content">
                    Hello!, I am Wonka AI Assistant, how can I help you today?
                </div>

            </div>

        </section>

        <form class="chat-input-area" id="chat-form">

            <input
                type="text"
                id="message-input"
                placeholder="Ask Wonka AI..."
                autocomplete="off"
            />

            <button type="submit" id="send-button">
                Send
            </button>

        </form>

    </main>
`;


// ==========================================
// Chat Form
// ==========================================

const chatForm =
    document.querySelector<HTMLFormElement>("#chat-form");

if (!chatForm) {
    throw new Error("Chat form not found");
}


// ==========================================
// Handle Message Submission
// ==========================================

chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = getInputValue();

    if (!message) {
        return;
    }

    // Display user's message
    addUserMessage(message);

    // Clear input
    clearInput();

    // Show loading state
    showThinkingIndicator();

    try {
        const data = await sendMessage(1, message);

        // Remove loading state
        removeThinkingIndicator();

        // Display assistant response
        addAssistantMessage(data.response);

    } catch (error) {
        console.error("Chat error:", error);

        // Remove loading state
        removeThinkingIndicator();

        addAssistantMessage(
            "Sorry, something went wrong while processing your message."
        );
    }
});