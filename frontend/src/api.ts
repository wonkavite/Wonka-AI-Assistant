// ==========================================
// API Configuration
// ==========================================

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";


// ==========================================
// Types
// ==========================================

export interface ChatRequest {
    user_id: number;
    message: string;
}

export interface ChatResponse {
    user_id: number;
    response: string;
}


// ==========================================
// Send Chat Message
// ==========================================

export async function sendMessage(
    userId: number,
    message: string
): Promise<ChatResponse> {

    const requestData: ChatRequest = {
        user_id: userId,
        message: message
    };

    const response = await fetch(
        `${API_BASE_URL}/chat/`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(requestData)
        }
    );

    // Handle HTTP errors
    if (!response.ok) {

        let errorMessage = "Something went wrong.";

        try {
            const errorData = await response.json();

            if (errorData.detail) {
                errorMessage = errorData.detail;
            }
        } catch {
            // Response wasn't valid JSON
        }

        throw new Error(errorMessage);
    }

    const data: ChatResponse = await response.json();

    return data;
}

//Authentication types

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    message: string;
    user_id: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    user_id: number;
}
///Register user
export async function registerUser(
    username: string,
    email: string,
    password: string
): Promise<RegisterResponse> {

    const requestData: RegisterRequest = {
        username: username,
        email: email,
        password: password
    };

    const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        }
    );

    if (!response.ok) {
        let errorMessage = "Registration failed.";

        try {
            const errorData = await response.json();

            if (errorData.detail) {
                errorMessage = errorData.detail;
            }
        } catch {
            // Response wasn't valid JSON
        }

        throw new Error(errorMessage);
    }

    const data: RegisterResponse = await response.json();

    return data;
}

///Login user
export async function loginUser(
    email: string,
    password: string
): Promise<LoginResponse> {

    const requestData: LoginRequest = {
        email: email,
        password: password
    };

    const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        }
    );

    if (!response.ok) {
        let errorMessage = "Login failed.";

        try {
            const errorData = await response.json();

            if (errorData.detail) {
                errorMessage = errorData.detail;
            }
        } catch {
            // Response wasn't valid JSON
        }

        throw new Error(errorMessage);
    }

    const data: LoginResponse = await response.json();

    return data;
}