import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ConfirmPopup from '../components/ConfirmPopup'
import Dropdown from '../components/Dropdown'
import '../styles/IssueForm.css'
import '../styles/Button.css'
import '../styles/IssueDetailsPopup.css'
import {
    ISSUE_PRIORITY_OPTIONS,
    ISSUE_SEVERITY_OPTIONS,
    type IssuePriority,
    type IssueSeverity,
} from '../constants/issues'
import { getIssueById, updateIssue } from '../services/issues'

function EditIssue() {
    const { id } = useParams<{ id: string }>()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<IssuePriority>('Medium')
    const [severity, setSeverity] = useState<IssueSeverity>('Minor')
    const [initialSnapshot, setInitialSnapshot] = useState<string>('')
    const [showCancelConfirm, setShowCancelConfirm] = useState(false)
    const [statusMessage, setStatusMessage] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    const storageKey = id ? `edit_issue` : '' // Key for the local storage to save the initial issue state

    // Create a snapshot of the current form state to compare against the initial state
    const currentSnapshot = useMemo(() => {
        return JSON.stringify({ title, description, priority, severity })
    }, [title, description, priority, severity])

    // Determine if there are unsaved changes by comparing the current snapshot with the initial snapshot
    const hasUnsavedChanges = useMemo(() => {
        if (!initialSnapshot) {
            return false
        }
        return currentSnapshot !== initialSnapshot
    }, [currentSnapshot, initialSnapshot])

    // Load the issue details when the component mounts
    useEffect(() => {
        if (!id) {
            setStatusMessage('Issue not found.')
            setIsLoading(false)
            return
        }

        // Fetch issue details and populate the form fields
        const loadIssue = async () => {
            try {
                const issue = await getIssueById(id)
                setTitle(issue.title)
                setDescription(issue.description)
                setPriority(issue.priority)
                setSeverity(issue.severity)
                const snapshot = JSON.stringify({
                    title: issue.title,
                    description: issue.description,
                    priority: issue.priority,
                    severity: issue.severity,
                })
                setInitialSnapshot(snapshot)
                if (storageKey) {
                    localStorage.setItem(storageKey, snapshot)
                }
            } catch (err) {
                const message =
                    err instanceof Error ? err.message : 'Failed to load issue.'
                setStatusMessage(message)
            } finally {
                setIsLoading(false)
            }
        }

        loadIssue()
    }, [id])

    // Restore the initial snapshot when the component mounts
    useEffect(() => {
        if (!storageKey || initialSnapshot) {
            return
        }

        const stored = localStorage.getItem(storageKey)
        if (stored) {
            setInitialSnapshot(stored)
        }
    }, [initialSnapshot, storageKey])

    // Warn the user about unsaved changes when they try to close the tab or navigate away
    useEffect(() => {
        if (!hasUnsavedChanges) {
            return
        }

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault()
            event.returnValue = ''
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [hasUnsavedChanges])

    // Handle form submission to update the issue
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!id) {
            return
        }

        try {
            await updateIssue(id, {
                title,
                description,
                priority,
                severity,
            })
            setStatusMessage('Issue updated successfully. Redirecting to dashboard...')
            if (storageKey) {
                localStorage.removeItem(storageKey)
            }
            setTimeout(() => {
                navigate('/dashboard')
            }, 900)
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Failed to update issue.'
            setStatusMessage(message)
        }
    }

    // Handle navigation back to the dashboard
    const handleBack = () => {
        if (hasUnsavedChanges) {
            setShowCancelConfirm(true)
            return
        }

        if (storageKey) {
            localStorage.removeItem(storageKey)
        }
        navigate('/dashboard')
    }

    // Confirm cancel changes and navigate back to the dashboard, discarding any unsaved changes
    const confirmCancelChanges = () => {
        if (storageKey) {
            localStorage.removeItem(storageKey)
        }
        setShowCancelConfirm(false)
        navigate('/dashboard')
    }

    // Cancel canceling changes and keep the user on the edit page
    const cancelCancelChanges = () => {
        setShowCancelConfirm(false)
    }

    return (
        <div className="dashboard-page">
            <div className="topbar">
                <span className="topbar__title">Issue Tracker</span>
            </div>

            <div className="dashboard">
                <header className="page-header">
                    <div>
                        <h1>Edit Issue</h1>
                        <p>Update the details of this issue.</p>
                    </div>
                    <div className="page-header__actions">
                        <button
                            className="ghost-button"
                            type="button"
                            onClick={handleBack}
                        >
                            Back
                        </button>
                    </div>
                </header>

                <section className="panel create-panel">
                    {isLoading ? (
                        <p className="issue-details-dialog__hint">Loading issue...</p>
                    ) : (
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
                                    Save changes
                                </button>
                            </div>
                        </form>
                    )}
                </section>
            </div>

            {statusMessage && (
                <div className="auth-toast" role="status" aria-live="polite">
                    <div className="auth-toast__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                d="M9.6 16.2 5.9 12.5l1.6-1.6 2.1 2.1 6-6 1.6 1.6-7.6 7.6Z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>
                    <div className="auth-toast__text">{statusMessage}</div>
                </div>
            )}

            <ConfirmPopup
                open={showCancelConfirm}
                title="Discard changes"
                message="You have unsaved changes. Do you want to discard them?"
                confirmText="Yes"
                cancelText="No"
                onConfirm={confirmCancelChanges}
                onCancel={cancelCancelChanges}
            />
        </div>
    )
}

export default EditIssue
