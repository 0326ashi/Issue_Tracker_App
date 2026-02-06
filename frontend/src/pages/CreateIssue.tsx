import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Dropdown from '../components/Dropdown'

type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical'
type IssueSeverity = 'Minor' | 'Major' | 'Critical'

// Options for priority and severity
const priorityOptions: IssuePriority[] = ['Low', 'Medium', 'High', 'Critical']
const severityOptions: IssueSeverity[] = ['Minor', 'Major', 'Critical']

// Create Issue component with form fields for title, description, priority, and severity
function CreateIssue() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<IssuePriority>('Medium')
    const [severity, setSeverity] = useState<IssueSeverity>('Minor')
    const navigate = useNavigate()

    // Handle form submission
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
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
                                    options={priorityOptions.map((option) => ({
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
                                    options={severityOptions.map((option) => ({
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
        </div>
    )
}

export default CreateIssue
