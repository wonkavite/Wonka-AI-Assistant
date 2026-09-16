// ==========================================
// API Configuration
// ==========================================

const API_BASE_URL = "http://localhost:8000";


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