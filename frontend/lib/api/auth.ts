/**
 * API Client for Authentication
 */

interface LoginCredentials {
    employeeId: string;
    email: string;
    password: string;
}

interface LoginResponse {
    message: string;
    user: {
        id: number;
        employeeId: string;
        email: string;
        role: 'ADMIN' | 'HR' | 'EMPLOYEE';
        isFirstLogin: boolean;
    };
}

interface ApiError {
    error: string;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || 'Login failed');
    }

    return response.json();
}

export async function logout(): Promise<void> {
    await fetch('/api/auth/logout', {
        method: 'POST',
    });
}

export async function getCurrentUser() {
    const response = await fetch('/api/users/me');

    if (!response.ok) {
        return null;
    }

    return response.json();
}
