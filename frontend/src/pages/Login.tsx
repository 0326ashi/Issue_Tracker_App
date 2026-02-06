import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { loginUser } from '../services/auth'

function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Submit credentials and persist the auth token on success
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        setIsSubmitting(true)

        try {
            const result = await loginUser({ email, password })
            localStorage.setItem('authToken', result.token)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed.'
            setError(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AuthLayout>
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-dot" aria-hidden="true" />
                    <h2>Login</h2>
                    <p>Welcome back. Let us get you back to work.</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
                    <label>
                        Email address
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            autoComplete="username"
                            required
                        />
                    </label>
                    <label>
                        Password
                        <div className="password-field">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword((current) => !current)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <svg viewBox="0 0 20 20" aria-hidden="true">
                                        <path
                                            d="M10 4c-3.6 0-6.7 2.2-8 5 1.3 2.8 4.4 5 8 5s6.7-2.2 8-5c-1.3-2.8-4.4-5-8-5Zm0 8.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"
                                            fill="currentColor"
                                        />
                                        <circle cx="10" cy="9" r="1.6" fill="currentColor" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 20 20" aria-hidden="true">
                                        <path
                                            d="M3 3.3 16.7 17l-1.3 1.3-2.6-2.6a7.8 7.8 0 0 1-2.8.5c-3.6 0-6.7-2.2-8-5 .7-1.5 1.7-2.7 2.9-3.6l-2.2-2.2L3 3.3Zm7 2.2c3.6 0 6.7 2.2 8 5-.6 1.3-1.5 2.4-2.6 3.3l-1.7-1.7a3.5 3.5 0 0 0-4.8-4.8L7.3 5.7c.8-.4 1.7-.6 2.7-.6Zm-3.3 3.3 4.5 4.5a3.5 3.5 0 0 1-4.5-4.5Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </label>
                    {error && <span className="auth-error">{error}</span>}
                    <button type="submit" className="auth-button" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                    <button type="button" className="link-button">
                        Forgot password?
                    </button>
                </form>

                <div className="auth-footer">
                    <span>Don't have an account?</span>
                    <Link to="/register" className="link-button">
                        Create an account
                    </Link>
                </div>
            </div>
        </AuthLayout>
    )
}

export default Login
