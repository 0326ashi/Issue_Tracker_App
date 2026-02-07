import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmPopup from '../components/ConfirmPopup'
import Dropdown from '../components/Dropdown'
import Toast from '../components/Toast'
import {
    ISSUE_PRIORITY_OPTIONS,
    ISSUE_SEVERITY_OPTIONS,
    ISSUE_STATUS_OPTIONS,
    type Issue,
    type IssuePriority,
    type IssueSeverity,
    type IssueStatus,
} from '../constants/issues'
import { deleteIssue, getIssues } from '../services/issues'

const statusOptions: Array<IssueStatus | 'All'> = ['All', ...ISSUE_STATUS_OPTIONS]
const priorityOptions: Array<IssuePriority | 'All'> = ['All', ...ISSUE_PRIORITY_OPTIONS]
const severityOptions: Array<IssueSeverity | 'All'> = ['All', ...ISSUE_SEVERITY_OPTIONS]

// Dashboard component for managing and displaying issues
function Dashboard() {
    const [issues, setIssues] = useState<Issue[]>([])
    const [query, setQuery] = useState('')
    const [debouncedQuery, setDebouncedQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<IssueStatus | 'All'>('All')
    const [priorityFilter, setPriorityFilter] = useState<IssuePriority | 'All'>('All')
    const [severityFilter, setSeverityFilter] = useState<IssueSeverity | 'All'>('All')
    const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)
    const navigate = useNavigate()
    const userName = localStorage.getItem('username') || 'User'

    const formatDate = (value: string) => {
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) {
            return value
        }

        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}-${month}-${year}`
    }

    useEffect(() => {
        const handle = setTimeout(() => {
            setDebouncedQuery(query.trim())
        }, 300)

        return () => clearTimeout(handle)
    }, [query])

    useEffect(() => {
        let isActive = true

        const load = async () => {
            try {
                const data = await getIssues()
                if (isActive) {
                    setIssues(data)
                }
            } catch {
                if (isActive) {
                    setIssues([])
                }
            }
        }

        load()

        return () => {
            isActive = false
        }
    }, [])

    const statusCounts = useMemo(() => {
        return issues.reduce(
            (acc, issue) => {
                acc[issue.status] += 1
                return acc
            },
            {
                Open: 0,
                'In Progress': 0,
                Resolved: 0,
                Closed: 0,
            } as Record<IssueStatus, number>,
        )
    }, [issues])

    const filteredIssues = useMemo(() => {
        const lowered = debouncedQuery.toLowerCase()

        return issues.filter((issue) => {
            const matchesQuery =
                lowered.length === 0 ||
                issue.title.toLowerCase().includes(lowered) ||
                issue.description.toLowerCase().includes(lowered)
            const matchesStatus = statusFilter === 'All' || issue.status === statusFilter
            const matchesPriority =
                priorityFilter === 'All' || issue.priority === priorityFilter
            const matchesSeverity =
                severityFilter === 'All' || issue.severity === severityFilter

            return matchesQuery && matchesStatus && matchesPriority && matchesSeverity
        })
    }, [debouncedQuery, issues, priorityFilter, severityFilter, statusFilter])

    const pageSize = 3
    const totalPages = Math.max(1, Math.ceil(filteredIssues.length / pageSize))
    const safePage = Math.min(page, totalPages)

    // Ensure current page is within valid range
    useEffect(() => {
        if (page !== safePage) {
            setPage(safePage)
        }
    }, [page, safePage])

    const pagedIssues = filteredIssues.slice(
        (safePage - 1) * pageSize,
        safePage * pageSize,
    )

    useEffect(() => {
        if (!showDeleteSuccess) {
            return undefined
        }

        // Auto-dismiss the success toast
        const timer = window.setTimeout(() => {
            setShowDeleteSuccess(false)
        }, 2600)

        return () => window.clearTimeout(timer)
    }, [showDeleteSuccess])

    // Deselect issue if it no longer exists in filtered list
    useEffect(() => {
        if (selectedIssueId && !filteredIssues.some((issue) => issue.id === selectedIssueId)) {
            setSelectedIssueId(null)
        }
    }, [filteredIssues, selectedIssueId])

    const selectedIssue = useMemo(() => {
        return issues.find((issue) => issue.id === selectedIssueId) || null
    }, [issues, selectedIssueId])

    // Reset all filters to default values
    const resetFilters = () => {
        setQuery('')
        setStatusFilter('All')
        setPriorityFilter('All')
        setSeverityFilter('All')
    }

    const updateStatusWithConfirm = (status: IssueStatus) => {
        if (!selectedIssue) {
            return
        }

        const message =
            status === 'Resolved'
                ? 'Mark this issue as resolved?'
                : 'Close this issue?'

        if (!window.confirm(message)) {
            return
        }

        setIssues((current) =>
            current.map((issue) =>
                issue.id === selectedIssue.id ? { ...issue, status } : issue,
            ),
        )
    }

    const handleDeleteIssue = (issueId: string) => {
        setDeleteTargetId(issueId)
    }

    const cancelDelete = () => {
        if (!isDeleting) {
            setDeleteTargetId(null)
        }
    }

    const confirmDelete = async () => {
        if (!deleteTargetId) {
            return
        }

        setIsDeleting(true)
        try {
            await deleteIssue(deleteTargetId)
            setIssues((current) => current.filter((issue) => issue.id !== deleteTargetId))
            if (selectedIssueId === deleteTargetId) {
                setSelectedIssueId(null)
            }
            setDeleteTargetId(null)
            setShowDeleteSuccess(true)
        } catch {
            // Keep UI state unchanged on delete failure
        } finally {
            setIsDeleting(false)
        }
    }

    // Handle logout by clearing local storage and navigating to login page
    const handleLogout = () => {
        localStorage.clear()
        navigate('/login')
    }

    return (
        <div className="dashboard-page">
            <div className="topbar">
                <span className="topbar__title">Issue Tracker</span>
                <div className="topbar__right">
                    <span className="user-greeting">Welcome {userName}!</span>
                    <button
                        className="ghost-button ghost-button--topbar"
                        type="button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="dashboard">
                <header className="page-header">
                    <div>
                        <h1>Issue Management</h1>
                        <p>Track, prioritize, and resolve issues in one place.</p>
                    </div>
                    <div className="page-header__actions">
                        <button
                            className="primary-button"
                            type="button"
                            onClick={() => navigate('/issues/new')}
                        >
                            Create issue
                        </button>
                    </div>
                </header>

                <section className="panel status-overview">
                    <h2>Status Overview</h2>
                    <div className="status-pills">
                        <div className="status-pill status-pill--open">
                            <span className="status-pill__icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        d="M6 2h12v2h-1v4.1l-3.2 3.9 3.2 3.9V20h1v2H6v-2h1v-4.1L10.2 12 7 8.1V4H6Zm3 2v3.4l3 3.6 3-3.6V4Zm0 16h6v-3.4l-3-3.6-3 3.6Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </span>
                            <span className="status-pill__label">Open</span>
                            <span className="status-pill__count">{statusCounts.Open}</span>
                        </div>
                        <div className="status-pill status-pill--progress">
                            <span className="status-pill__icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        d="m14.6 3 6.4 6.4-4.2 1.4-2.2 2.2 1.4 4.2-6.4-6.4 2.2-2.2Zm-7 7L11 13.4 6.8 17.6c-.6.6-1.6.6-2.2 0s-.6-1.6 0-2.2Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </span>
                            <span className="status-pill__label">In Progress</span>
                            <span className="status-pill__count">
                                {statusCounts['In Progress']}
                            </span>
                        </div>
                        <div className="status-pill status-pill--resolved">
                            <span className="status-pill__icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        d="M12 4a8 8 0 1 0 8 8 8 8 0 0 0-8-8Zm-1.1 10.6-3-3 1.4-1.4 1.6 1.6 4-4 1.4 1.4Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </span>
                            <span className="status-pill__label">Resolved</span>
                            <span className="status-pill__count">{statusCounts.Resolved}</span>
                        </div>
                    </div>
                </section>

                <section className="panel list-panel">
                    <div className="filters-bar">
                        <div className="filter-field">
                            <span>Status</span>
                            <Dropdown
                                label="Status"
                                value={statusFilter}
                                options={statusOptions.map((option) => ({
                                    value: option,
                                    label: option,
                                }))}
                                onChange={setStatusFilter}
                            />
                        </div>
                        <div className="filter-field">
                            <span>Priority</span>
                            <Dropdown
                                label="Priority"
                                value={priorityFilter}
                                options={priorityOptions.map((option) => ({
                                    value: option,
                                    label: option,
                                }))}
                                onChange={setPriorityFilter}
                            />
                        </div>
                        <div className="filter-field">
                            <span>Severity</span>
                            <Dropdown
                                label="Severity"
                                value={severityFilter}
                                options={severityOptions.map((option) => ({
                                    value: option,
                                    label: option,
                                }))}
                                onChange={setSeverityFilter}
                            />
                        </div>
                        <button
                            className="ghost-button ghost-button--compact"
                            type="button"
                            onClick={resetFilters}
                        >
                            Reset
                        </button>
                    </div>

                    <div className="filters-divider" />

                    <div className="issue-list">
                        {pagedIssues.length === 0 && (
                            <div className="issue-empty issue-empty--center">
                                <p>There are no issues</p>
                            </div>
                        )}

                        {pagedIssues.map((issue) => (
                            <article
                                key={issue.id}
                                className={`issue-card issue-card--${issue.status
                                    .toLowerCase()
                                    .replace(' ', '-')}`}
                            >
                                <div className="issue-card__header">
                                    <div>
                                        <h3>{issue.title}</h3>
                                        <p>{issue.description}</p>
                                    </div>
                                </div>
                                <div className="issue-card__meta">
                                    <span className={`badge badge--status badge--${issue.status
                                        .toLowerCase()
                                        .replace(' ', '-')}`}>
                                        {issue.status}
                                    </span>
                                    <span className={`badge badge--priority badge--${issue.priority
                                        .toLowerCase()}`}>
                                        {issue.priority} priority
                                    </span>
                                    <span className={`badge badge--severity badge--${issue.severity
                                        .toLowerCase()}`}>
                                        {issue.severity} severity
                                    </span>
                                </div>
                                <div className="issue-card__actions">
                                    <span className="issue-card__date">
                                        Created on {formatDate(issue.createdAt)}
                                    </span>
                                    <div className="issue-card__buttons">
                                        <button
                                            className="icon-button"
                                            type="button"
                                            aria-label="View details"
                                        >
                                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                                <path
                                                    d="M12 5c-5 0-9.2 3-11 7 1.8 4 6 7 11 7s9.2-3 11-7c-1.8-4-6-7-11-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
                                                    fill="currentColor"
                                                />
                                                <circle cx="12" cy="12" r="2.2" fill="currentColor" />
                                            </svg>
                                            <span>View</span>
                                        </button>
                                        <button
                                            className="icon-button icon-button--edit"
                                            type="button"
                                            aria-label="Edit issue"
                                        >
                                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                                <path
                                                    d="m4 16.5 9.9-9.9 3.5 3.5-9.9 9.9H4Zm12.4-11.2 1.3-1.3a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4l-1.3 1.3Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            className="icon-button icon-button--delete"
                                            type="button"
                                            onClick={() => handleDeleteIssue(issue.id)}
                                            aria-label="Delete issue"
                                        >
                                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                                <path
                                                    d="M9 4h6l1 2h4v2H4V6h4l1-2Zm1 6h2v8h-2v-8Zm4 0h2v8h-2v-8ZM6 8h12l-1 12H7Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="list-footer">
                        <span>Total: {filteredIssues.length}</span>
                        <div className="pagination">
                            <button
                                type="button"
                                className="ghost-button ghost-button--compact"
                                disabled={safePage === 1}
                                onClick={() => setPage((current) => Math.max(1, current - 1))}
                            >
                                Prev
                            </button>
                            <span className="pagination__current">{safePage}</span>
                            <button
                                type="button"
                                className="ghost-button ghost-button--compact"
                                disabled={safePage === totalPages}
                                onClick={() =>
                                    setPage((current) => Math.min(totalPages, current + 1))
                                }
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </section>

                {selectedIssue && (
                    <section className="panel detail-panel">
                        <div className="panel-header">
                            <div>
                                <h2>Issue details</h2>
                            </div>
                            <span className={`badge badge--status badge--${selectedIssue.status
                                .toLowerCase()
                                .replace(' ', '-')}`}>
                                {selectedIssue.status}
                            </span>
                        </div>

                        <>
                            <p className="issue-details__description">
                                {selectedIssue.description}
                            </p>
                            <div className="issue-details__meta">
                                <div>
                                    <span>Priority</span>
                                    <strong>{selectedIssue.priority}</strong>
                                </div>
                                <div>
                                    <span>Severity</span>
                                    <strong>{selectedIssue.severity}</strong>
                                </div>
                                <div>
                                    <span>Created</span>
                                    <strong>{formatDate(selectedIssue.createdAt)}</strong>
                                </div>
                            </div>
                            <div className="issue-details__actions">
                                <button className="primary-button" type="button">
                                    Edit issue
                                </button>
                                {selectedIssue.status !== 'Resolved' && (
                                    <button
                                        className="ghost-button"
                                        type="button"
                                        onClick={() => updateStatusWithConfirm('Resolved')}
                                    >
                                        Mark resolved
                                    </button>
                                )}
                            </div>
                        </>
                    </section>
                )}
            </div>

            <ConfirmPopup
                open={deleteTargetId !== null}
                title="Delete issue"
                message="Are you sure you want to delete this issue?"
                confirmText="Yes"
                cancelText="No"
                confirmDisabled={isDeleting}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />

            {showDeleteSuccess && (
                <Toast message="Issue deleted successfully." />
            )}
        </div>
    )
}

export default Dashboard
