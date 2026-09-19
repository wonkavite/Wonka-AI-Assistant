import "./style.css";

import {
    addUserMessage,
    addAssistantMessage,
    getInputValue,
    clearInput,
    showThinkingIndicator,
    removeThinkingIndicator
} from "./ui";


import {
    sendMessage,
    registerUser,
    loginUser
} from "./api";

import {
    saveUserId,
    getUserId,
    clearUserId,
    isLoggedIn
} from "./auth";




const appElement = document.querySelector<HTMLDivElement>("#app");

if (!appElement) {
    throw new Error("App element not found");
}
const app=appElement;

// ==========================================
// ==========================================
// Landing View
// ==========================================

function showLandingView(): void {

    app.innerHTML = `
        <main class="landing-app">

            <section class="landing-content">

                <div class="landing-brand">

                    <div
                        class="landing-icon"
                        aria-hidden="true"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <rect
                                x="5"
                                y="6"
                                width="14"
                                height="13"
                                rx="4"
                            ></rect>

                            <path d="M9 11h.01"></path>
                            <path d="M15 11h.01"></path>

                            <path
                                d="M9 15c1.5 1 4.5 1 6 0"
                            ></path>

                            <path
                                d="M12 6V3"
                            ></path>

                            <circle
                                cx="12"
                                cy="2.5"
                                r=".5"
                            ></circle>
                        </svg>
                    </div>

                    <h1>
                        Welcome to Wonka AI Assistant
                    </h1>

                </div>

                <p class="landing-description">
                    Your AI assistant for learning,
                    building, and exploring technology.
                </p>

                <button
                    type="button"
                    id="ask-ai-button"
                    class="ask-ai-button"
                >
                    Ask Wonka AI
                </button>

            </section>

        </main>
    `;

    setupLandingView();
}








// Landing View Setup
// ==========================================

function setupLandingView(): void {

    const askAiButton =
        document.querySelector<HTMLButtonElement>(
            "#ask-ai-button"
        );

    if (!askAiButton) {
        throw new Error("Ask AI button not found");
    }

    askAiButton.addEventListener("click", () => {

        showRegisterView();

    });
}
// ==========================================
// Login View
// ==========================================

function showLoginView(): void {
    app.innerHTML = `
        <main class="auth-app">

            <section class="auth-card">

                <header class="auth-header">
                    <h1>Wonka AI Assistant</h1>
                    <p>Login to continue</p>
                </header>

                <form id="login-form" class="auth-form">

                    <div class="form-group">
                        <label for="login-email">
                            Email
                        </label>

                        <input
                            type="email"
                            id="login-email"
                            placeholder="Enter your email"
                            autocomplete="email"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label for="login-password">
                            Password
                        </label>

                        <input
                            type="password"
                            id="login-password"
                            placeholder="Enter your password"
                            autocomplete="current-password"
                            required
                        />
                    </div>

                    <p
                        id="login-error"
                        class="auth-error"
                        aria-live="polite"
                    ></p>

                    <button
                        type="submit"
                        class="auth-button"
                    >
                        Login
                    </button>

                </form>

                <p class="auth-switch">
                    Don't have an account?
                    <button
                        type="button"
                        id="show-register"
                        class="auth-link"
                    >
                        Register
                    </button>
                </p>


                <button
    type="button"
    id="back-to-landing"
    class="auth-back-button"
>
    ← Back
</button>

            </section>

        </main>
    `;

    setupLoginForm();
}





// ==========================================
// Chat View
// ==========================================

function showChatView(): void {
    app.innerHTML = `
        <main class="chat-app">

            <header class="chat-header">
                <h1>Wonka AI Assistant</h1>

                <button
                    type="button"
                    id="logout-button"
                    class="logout-button"
                >
                    Logout
                </button>
            </header>

            <section
                class="chat-messages"
                id="chat-messages"
            >
                <div class="message assistant-message">

                    <div
                        class="message-icon assistant-icon"
                        aria-hidden="true"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <rect
                                x="5"
                                y="6"
                                width="14"
                                height="13"
                                rx="4"
                            ></rect>

                            <path d="M9 11h.01"></path>
                            <path d="M15 11h.01"></path>

                            <path
                                d="M9 15c1.5 1 4.5 1 6 0"
                            ></path>

                            <path
                                d="M12 6V3"
                            ></path>

                            <circle
                                cx="12"
                                cy="2.5"
                                r=".5"
                            ></circle>
                        </svg>
                    </div>

                    <div class="message-content">
                        Hello!, I am Wonka AI Assistant,
                        how can I help you today?
                    </div>

                </div>
            </section>

            <form
                class="chat-input-area"
                id="chat-form"
            >
                <input
                    type="text"
                    id="message-input"
                    placeholder="Ask Wonka AI..."
                    autocomplete="off"
                />

                <button
                    type="submit"
                    id="send-button"
                >
                    Send
                </button>
            </form>

        </main>
    `;

    setupChatForm();
    setupLogout();
}






// ==========================================
// Login Form
// ==========================================

function setupLoginForm(): void {


    const backButton =
    document.querySelector<HTMLButtonElement>(
        "#back-to-landing"
    );

if (!backButton) {
    throw new Error("Back button not found");
}

backButton.addEventListener("click", () => {
    showLandingView();
});



    const loginForm =
        document.querySelector<HTMLFormElement>("#login-form");

    if (!loginForm) {
        throw new Error("Login form not found");
    }

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const emailInput =
            document.querySelector<HTMLInputElement>("#login-email");

        const passwordInput =
            document.querySelector<HTMLInputElement>("#login-password");

        const errorElement =
            document.querySelector<HTMLParagraphElement>("#login-error");

        if (!emailInput || !passwordInput || !errorElement) {
            throw new Error("Login elements not found");
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        errorElement.textContent = "";

        try {
            const data = await loginUser(
                email,
                password
            );

            saveUserId(data.user_id);

            showChatView();

        } catch (error) {
            console.error("Login error:", error);

            errorElement.textContent =
                error instanceof Error
                    ? error.message
                    : "Login failed. Please try again.";
        }
    });

    const registerButton =
        document.querySelector<HTMLButtonElement>("#show-register");

    if (!registerButton) {
        throw new Error("Register button not found");
    }

    registerButton.addEventListener("click", () => {
        showRegisterView();
    });
}

// ==========================================
// Register View
// ==========================================

function showRegisterView(): void {
    app.innerHTML = `
        <main class="auth-app">

            <section class="auth-card">

                <header class="auth-header">
                    <h1>Wonka AI Assistant</h1>
                    <p>Create your account</p>
                </header>

                <form id="register-form" class="auth-form">

                    <div class="form-group">
                        <label for="register-username">
                            Username
                        </label>

                        <input
                            type="text"
                            id="register-username"
                            placeholder="Choose a username"
                            autocomplete="username"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label for="register-email">
                            Email
                        </label>

                        <input
                            type="email"
                            id="register-email"
                            placeholder="Enter your email"
                            autocomplete="email"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label for="register-password">
                            Password
                        </label>

                        <div class="password-input-wrapper">
                            <input
                                type="password"
                                id="register-password"
                                placeholder="Create a password"
                                autocomplete="new-password"
                                required
                            />

                            <button
                                type="button"
                                class="password-toggle"
                                id="toggle-register-password"
                                aria-label="Show password"
                                aria-pressed="false"
                            >
                                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"></path>
                                    <circle cx="12" cy="12" r="2.5"></circle>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="register-password-confirm">
                            Confirm password
                        </label>

                        <div class="password-input-wrapper">
                            <input
                                type="password"
                                id="register-password-confirm"
                                placeholder="Re-enter your password"
                                autocomplete="new-password"
                                required
                            />

                            <button
                                type="button"
                                class="password-toggle"
                                id="toggle-register-password-confirm"
                                aria-label="Show confirmation password"
                                aria-pressed="false"
                            >
                                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"></path>
                                    <circle cx="12" cy="12" r="2.5"></circle>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <p
                        id="register-error"
                        class="auth-error"
                        aria-live="polite"
                    ></p>

                    <button
                        type="submit"
                        class="auth-button"
                    >
                        Register
                    </button>

                </form>

                <p class="auth-switch">
                    Already have an account?
                    <button
                        type="button"
                        id="show-login"
                        class="auth-link"
                    >
                        Login
                    </button>
                </p>
                <button
    type="button"
    id="back-to-landing"
    class="auth-back-button"
>
    ← Back
</button>

            </section>

        </main>
    `;

    setupRegisterForm();
}





// ==========================================
// Register Form
// ==========================================

function setupPasswordToggle(
    inputId: string,
    toggleId: string
): void {
    const passwordInput =
        document.querySelector<HTMLInputElement>(`#${inputId}`);

    const toggleButton =
        document.querySelector<HTMLButtonElement>(`#${toggleId}`);

    if (!passwordInput || !toggleButton) {
        throw new Error("Password visibility controls not found");
    }

    toggleButton.addEventListener("click", () => {
        const isVisible = passwordInput.type === "text";

        passwordInput.type = isVisible ? "password" : "text";
        toggleButton.setAttribute("aria-pressed", String(!isVisible));
        toggleButton.setAttribute(
            "aria-label",
            isVisible ? "Show password" : "Hide password"
        );
    });
}

function setupRegisterForm(): void {


   const backButton =
    document.querySelector<HTMLButtonElement>(
        "#back-to-landing"
    );

if (!backButton) {
    throw new Error("Back button not found");
}

backButton.addEventListener("click", () => {
    showLandingView();
});


    const registerForm =
        document.querySelector<HTMLFormElement>("#register-form");

    if (!registerForm) {
        throw new Error("Register form not found");
    }

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const usernameInput =
            document.querySelector<HTMLInputElement>("#register-username");

        const emailInput =
            document.querySelector<HTMLInputElement>("#register-email");

        const passwordInput =
            document.querySelector<HTMLInputElement>("#register-password");

        const confirmPasswordInput =
            document.querySelector<HTMLInputElement>(
                "#register-password-confirm"
            );

        const errorElement =
            document.querySelector<HTMLParagraphElement>("#register-error");

        if (
            !usernameInput ||
            !emailInput ||
            !passwordInput ||
            !confirmPasswordInput ||
            !errorElement
        ) {
            throw new Error("Register elements not found");
        }

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        errorElement.textContent = "";

        if (password !== confirmPassword) {
            errorElement.textContent = "Passwords do not match.";
            confirmPasswordInput.setCustomValidity("Passwords do not match.");
            confirmPasswordInput.focus();
            return;
        }

        confirmPasswordInput.setCustomValidity("");

        try {
            await registerUser(
                username,
                email,
                password
            );

            showLoginView();

        } catch (error) {
            console.error("Registration error:", error);

            errorElement.textContent =
                error instanceof Error
                    ? error.message
                    : "Registration failed. Please try again.";
        }
    });

    const loginButton =
        document.querySelector<HTMLButtonElement>("#show-login");

    if (!loginButton) {
        throw new Error("Login button not found");
    }

    loginButton.addEventListener("click", () => {
        showLoginView();
    });

    const confirmPasswordInput =
        document.querySelector<HTMLInputElement>(
            "#register-password-confirm"
        );

    if (!confirmPasswordInput) {
        throw new Error("Password confirmation input not found");
    }

    const updatePasswordMatch = (): void => {
        const passwordInput =
            document.querySelector<HTMLInputElement>("#register-password");

        if (!passwordInput) {
            return;
        }

        confirmPasswordInput.setCustomValidity(
            confirmPasswordInput.value &&
            passwordInput.value !== confirmPasswordInput.value
                ? "Passwords do not match."
                : ""
        );
    };

    document
        .querySelector<HTMLInputElement>("#register-password")
        ?.addEventListener("input", updatePasswordMatch);
    confirmPasswordInput.addEventListener("input", updatePasswordMatch);

    setupPasswordToggle(
        "register-password",
        "toggle-register-password"
    );
    setupPasswordToggle(
        "register-password-confirm",
        "toggle-register-password-confirm"
    );
}









// ==========================================
// Chat Form
// ==========================================

// ==========================================
// Chat Form
// ==========================================

function setupChatForm(): void {

    const chatForm =
        document.querySelector<HTMLFormElement>("#chat-form");

    if (!chatForm) {
        throw new Error("Chat form not found");
    }

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

            const userId = getUserId();

            if (userId === null) {
                throw new Error("User is not logged in.");
            }

            const data = await sendMessage(
                userId,
                message
            );

            removeThinkingIndicator();

            addAssistantMessage(
                data.response
            );

        } catch (error) {

            console.error(
                "Chat error:",
                error
            );

            removeThinkingIndicator();

            addAssistantMessage(
                "Sorry, something went wrong while processing your message."
            );
        }
    });
}






// ==========================================
// Logout
// ==========================================

function setupLogout(): void {

    const logoutButton =
        document.querySelector<HTMLButtonElement>(
            "#logout-button"
        );

    if (!logoutButton) {
        throw new Error("Logout button not found");
    }

    logoutButton.addEventListener("click", () => {

        clearUserId();

        showLoginView();

    });
}


// ==========================================
// Handle Message Submission
// ==========================================






// ==========================================
// Application Startup
// ==========================================

if (isLoggedIn()) {

    showChatView();

} else {

    showLandingView();

}