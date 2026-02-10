const API_URL = 'http://localhost:5000'

// Define types for successful authentication response and error response
type AuthResponse = {
    token: string
    user: {
        id: string
        name: string
        email: string
    }
}

type AuthError = {
    message: string
}

// Helper function to handle API responses for both login and registration
const handleResponse = async (response: Response): Promise<AuthResponse> => {
    const data = (await response.json()) as AuthResponse | AuthError

    if (!response.ok) {
        const errorMessage =
            'message' in data ? data.message : 'Something went wrong.'
        throw new Error(errorMessage)
    }

    return data as AuthResponse
}

// Register a new user
export const registerUser = async (payload: {
    name: string
    email: string
    password: string
}): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })

    return handleResponse(response)
}

// Login for an existing user
export const loginUser = async (payload: {
    email: string
    password: string
}): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })

    return handleResponse(response)
}
