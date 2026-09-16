// ==========================================
// Get Chat Elements
// ==========================================

function getChatMessages(): HTMLDivElement {
    const element =
        document.querySelector<HTMLDivElement>("#chat-messages");

    if (!element) {
        throw new Error("Chat messages element not found");
    }

    return element;
}

function getMessageInput(): HTMLInputElement {
    const element =
        document.querySelector<HTMLInputElement>("#message-input");

    if (!element) {
        throw new Error("Message input element not found");
    }

    return element;
}


// ==========================================
// Add User Message
// ==========================================

export function addUserMessage(message: string): void {
    const chatMessages = getChatMessages();

    const messageElement = document.createElement("div");

    messageElement.className = "message user-message";

    const icon = document.createElement("div");
    icon.className = "message-icon user-icon";
    icon.setAttribute("aria-hidden", "true");

    icon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4"></circle>
            <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"></path>
        </svg>
    `;

    const content = document.createElement("div");
    content.className = "message-content";
    content.textContent = message;

    messageElement.appendChild(icon);
    messageElement.appendChild(content);

    chatMessages.appendChild(messageElement);

    scrollToBottom();
}


// ==========================================
// Add Assistant Message
// ==========================================

export function addAssistantMessage(message: string): void {
    const chatMessages = getChatMessages();

    const messageElement = document.createElement("div");

    messageElement.className = "message assistant-message";

    const icon = document.createElement("div");
    icon.className = "message-icon assistant-icon";
    icon.setAttribute("aria-hidden", "true");

    icon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none">
            <rect x="5" y="6" width="14" height="13" rx="4"></rect>
            <path d="M9 11h.01"></path>
            <path d="M15 11h.01"></path>
            <path d="M9 15c1.5 1 4.5 1 6 0"></path>
            <path d="M12 6V3"></path>
            <circle cx="12" cy="2.5" r=".5"></circle>
        </svg>
    `;

    const content = document.createElement("div");
    content.className = "message-content";
    content.textContent = message;

    messageElement.appendChild(icon);
    messageElement.appendChild(content);

    chatMessages.appendChild(messageElement);

    scrollToBottom();
}


// ==========================================
// Get Input Value
// ==========================================

export function getInputValue(): string {
    return getMessageInput().value.trim();
}


// ==========================================
// Clear Input
// ==========================================

export function clearInput(): void {
    getMessageInput().value = "";
}


// ==========================================
// Scroll to Bottom
// ==========================================

export function scrollToBottom(): void {
    const chatMessages = getChatMessages();

    chatMessages.scrollTop = chatMessages.scrollHeight;
}


let thinkingMessage: HTMLDivElement | null = null;


// ==========================================
// Show Thinking Indicator
// ==========================================

export function showThinkingIndicator(): void {
    const chatMessages = getChatMessages();

    // Prevent duplicate indicators
    if (thinkingMessage) {
        return;
    }

    thinkingMessage = document.createElement("div");

    thinkingMessage.className = "message assistant-message thinking-message";

    thinkingMessage.innerHTML = `
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

        <div class="message-content thinking-content">
            Thinking<span class="thinking-dots">...</span>
        </div>
    `;

    chatMessages.appendChild(thinkingMessage);

    scrollToBottom();
}


// ==========================================
// Remove Thinking Indicator
// ==========================================

export function removeThinkingIndicator(): void {
    if (!thinkingMessage) {
        return;
    }

    thinkingMessage.remove();

    thinkingMessage = null;
}