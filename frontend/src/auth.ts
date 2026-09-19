// ==========================================
// Authentication State
// ==========================================

const USER_ID_KEY = "wonka_user_id";


// ==========================================
// Save User ID
// ==========================================

export function saveUserId(userId: number): void {
    localStorage.setItem(
        USER_ID_KEY,
        String(userId)
    );
}


// ==========================================
// Get User ID
// ==========================================

export function getUserId(): number | null {
    const storedUserId = localStorage.getItem(USER_ID_KEY);

    if (!storedUserId) {
        return null;
    }

    const userId = Number(storedUserId);

    if (Number.isNaN(userId) || userId <= 0) {
        return null;
    }

    return userId;
}


// ==========================================
// Check Authentication
// ==========================================

export function isLoggedIn(): boolean {
    return getUserId() !== null;
}


// ==========================================
// Logout
// ==========================================

export function clearUserId(): void {
    localStorage.removeItem(USER_ID_KEY);
}