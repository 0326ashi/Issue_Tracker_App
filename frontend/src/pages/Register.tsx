import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { registerUser } from '../services/auth'

function Register() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccessOpen, setIsSuccessOpen] = useState(false)
    const navigate = useNavigate()

    // Close the success modal and navigate to login
    const handleSuccessContinue = () => {
        setIsSuccessOpen(false)
        navigate('/login')
    }

    // Submit credentials and persist the auth token on success
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setIsSubmitting(true)

        try {
            const result = await registerUser({ name, email, password })
            localStorage.setItem('authToken', result.token)
            setIsSuccessOpen(true)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Sign up failed.'
            setError(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AuthLayout className="auth-shell--no-scroll">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-dot" aria-hidden="true" />
                    <h2>Create account</h2>
                    <p>Get started in seconds.</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
                    <label>
                        Name
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            autoComplete="name"
                            required
                        />
                    </label>
                    <label>
                        Email address
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            autoComplete="email"
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
                                autoComplete="new-password"
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
                    <label>
                        Confirm password
                        <div className="password-field">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                autoComplete="new-password"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword((current) => !current)}
                                aria-label={
                                    showConfirmPassword ? 'Hide password' : 'Show password'
                                }
                            >
                                {showConfirmPassword ? (
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
                        {isSubmitting ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>Already have an account?</span>
                    <Link to="/login" className="link-button">
                        Login
                    </Link>
                </div>
            </div>
            {isSuccessOpen && (
                <div className="auth-modal-backdrop" role="presentation">
                    <div
                        className="auth-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="success-title"
                        aria-describedby="success-desc"
                    >
                        <div className="auth-modal__icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                    d="M9.6 16.2 5.9 12.5l1.6-1.6 2.1 2.1 6-6 1.6 1.6-7.6 7.6Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </div>
                        <h3 id="success-title">Account created</h3>
                        <p id="success-desc">
                            You can now log in with your new account.
                        </p>
                        <div className="auth-modal__actions">
                            <button
                                type="button"
                                className="auth-button"
                                onClick={handleSuccessContinue}
                            >
                                Continue to login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthLayout>
    )
}

export default Register
