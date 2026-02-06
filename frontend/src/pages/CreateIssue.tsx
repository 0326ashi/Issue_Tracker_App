import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Dropdown from '../components/Dropdown'
import {
    ISSUE_PRIORITY_OPTIONS,
    ISSUE_SEVERITY_OPTIONS,
    type IssuePriority,
    type IssueSeverity,
} from '../constants/issues'
import { createIssue } from '../services/issues'

// Create Issue component with form fields for title, description, priority, and severity
function CreateIssue() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<IssuePriority>('Medium')
    const [severity, setSeverity] = useState<IssueSeverity>('Minor')
    const [successMessage, setSuccessMessage] = useState('')
    const navigate = useNavigate()

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            await createIssue({
                title,
                description,
                priority,
                severity,
            })
            setSuccessMessage('Issue created successfully. Redirecting to dashboard...')
            setTimeout(() => {
                navigate('/dashboard')
            }, 900)
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Failed to create issue.'
            setSuccessMessage(message)
        }
    }

    return (
        <div className="dashboard-page">
            <div className="topbar">
                <span className="topbar__title">Issue Tracker</span>
            </div>

            <div className="dashboard">
                <header className="page-header">
                    <div>
                        <h1>Create an Issue</h1>
                        <p>Log a new issue in here</p>
                    </div>
                    <div className="page-header__actions">
                        <button
                            className="ghost-button"
                            type="button"
                            onClick={() => navigate('/dashboard')}
                        >
                            Back
                        </button>
                    </div>
                </header>

                <section className="panel create-panel">
                    <form className="issue-form issue-form--stack" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Title *"
                            required
                        />
                        <textarea
                            rows={5}
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="Description *"
                            required
                        />
                        <div className="issue-form__row">
                            <div className="issue-form__field">
                                <span>Priority</span>
                                <Dropdown
                                    label="Priority"
                                    value={priority}
                                    options={ISSUE_PRIORITY_OPTIONS.map((option) => ({
                                        value: option,
                                        label: option,
                                    }))}
                                    onChange={setPriority}
                                />
                            </div>
                            <div className="issue-form__field">
                                <span>Severity</span>
                                <Dropdown
                                    label="Severity"
                                    value={severity}
                                    options={ISSUE_SEVERITY_OPTIONS.map((option) => ({
                                        value: option,
                                        label: option,
                                    }))}
                                    onChange={setSeverity}
                                />
                            </div>
                        </div>
                        <div className="issue-form__actions">
                            <button className="primary-button" type="submit">
                                Create issue
                            </button>
                        </div>
                    </form>
                </section>
            </div>
            {successMessage && (
                <div className="auth-toast" role="status" aria-live="polite">
                    <div className="auth-toast__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                d="M9.6 16.2 5.9 12.5l1.6-1.6 2.1 2.1 6-6 1.6 1.6-7.6 7.6Z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>
                    <div className="auth-toast__text">{successMessage}</div>
                </div>
            )}
        </div>
    )
}

export default CreateIssue
