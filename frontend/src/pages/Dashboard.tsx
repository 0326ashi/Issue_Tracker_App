import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmPopup from "../components/ConfirmPopup";
import IssueDetailsPopup from "../components/IssueDetailsPopup.tsx";
import Dropdown from "../components/Dropdown";
import Toast from "../components/Toast";
import openImage from "../assets/open.png";
import inProgressImage from "../assets/inprogress.png";
import resolvedImage from "../assets/resolved.png";
import {
    ISSUE_PRIORITY_OPTIONS,
    ISSUE_SEVERITY_OPTIONS,
    ISSUE_STATUS_OPTIONS,
    type Issue,
    type IssuePriority,
    type IssueSeverity,
    type IssueStatus,
} from "../constants/issues";
import {
    deleteIssue,
    getIssueById,
    getIssues,
    updateIssueStatus,
} from "../services/issues";

const statusOptions: Array<IssueStatus | "All"> = [
    "All",
    ...ISSUE_STATUS_OPTIONS,
];
const priorityOptions: Array<IssuePriority | "All"> = [
    "All",
    ...ISSUE_PRIORITY_OPTIONS,
];
const severityOptions: Array<IssueSeverity | "All"> = [
    "All",
    ...ISSUE_SEVERITY_OPTIONS,
];
const AUTO_DISMISS_MS = 2600;

const useAutoDismiss = (isVisible: boolean, onDismiss: () => void) => {
    useEffect(() => {
        if (!isVisible) {
            return undefined;
        }

        const timer = window.setTimeout(() => {
            onDismiss();
        }, AUTO_DISMISS_MS);

        return () => window.clearTimeout(timer);
    }, [isVisible, onDismiss]);
};

const useCloseOnOutsideAndEscape = (
    isOpen: boolean,
    ref: React.RefObject<HTMLElement | null>,
    onClose: () => void,
) => {
    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleOutsideClick = (event: MouseEvent) => {
            if (!ref.current?.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose, ref]);
};

// Dashboard component for managing and displaying issues
function Dashboard() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<IssueStatus | "All">("All");
    const [priorityFilter, setPriorityFilter] = useState<IssuePriority | "All">(
        "All",
    );
    const [severityFilter, setSeverityFilter] = useState<IssueSeverity | "All">(
        "All",
    );
    const [viewIssueId, setViewIssueId] = useState<string | null>(null);
    const [viewIssue, setViewIssue] = useState<Issue | null>(null);
    const [isViewLoading, setIsViewLoading] = useState(false);
    const [viewError, setViewError] = useState("");
    const [page, setPage] = useState(1);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [statusTargetId, setStatusTargetId] = useState<string | null>(null);
    const [statusTargetValue, setStatusTargetValue] =
        useState<IssueStatus | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [showStatusSuccess, setShowStatusSuccess] = useState(false);
    const [statusSuccessMessage, setStatusSuccessMessage] = useState("");
    const [openMarkMenuId, setOpenMarkMenuId] = useState<string | null>(null);
    const markMenuRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const userName = localStorage.getItem("username") || "User";

    const formatDate = (value: string) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    useEffect(() => {
        const handle = setTimeout(() => {
            setDebouncedQuery(query.trim());
        }, 300);

        return () => clearTimeout(handle);
    }, [query]);

    useEffect(() => {
        let isActive = true;

        const load = async () => {
            try {
                const data = await getIssues();
                if (isActive) {
                    setIssues(data);
                }
            } catch {
                if (isActive) {
                    setIssues([]);
                }
            }
        };

        load();

        return () => {
            isActive = false;
        };
    }, []);

    const statusCounts = useMemo(() => {
        return issues.reduce(
            (acc, issue) => {
                acc[issue.status] += 1;
                return acc;
            },
            {
                Open: 0,
                "In Progress": 0,
                Resolved: 0,
                Closed: 0,
            } as Record<IssueStatus, number>,
        );
    }, [issues]);

    const filteredIssues = useMemo(() => {
        const lowered = debouncedQuery.toLowerCase();

        return issues.filter((issue) => {
            const matchesQuery =
                lowered.length === 0 ||
                issue.title.toLowerCase().includes(lowered) ||
                issue.description.toLowerCase().includes(lowered);
            const matchesStatus =
                statusFilter === "All" || issue.status === statusFilter;
            const matchesPriority =
                priorityFilter === "All" || issue.priority === priorityFilter;
            const matchesSeverity =
                severityFilter === "All" || issue.severity === severityFilter;

            return (
                matchesQuery && matchesStatus && matchesPriority && matchesSeverity
            );
        });
    }, [debouncedQuery, issues, priorityFilter, severityFilter, statusFilter]);

    const pageSize = 5;
    const totalPages = Math.max(1, Math.ceil(filteredIssues.length / pageSize));
    const safePage = Math.min(page, totalPages);

    // Ensure current page is within valid range
    useEffect(() => {
        if (page !== safePage) {
            setPage(safePage);
        }
    }, [page, safePage]);

    const pagedIssues = filteredIssues.slice(
        (safePage - 1) * pageSize,
        safePage * pageSize,
    );

    useAutoDismiss(showDeleteSuccess, () => setShowDeleteSuccess(false));
    useAutoDismiss(showStatusSuccess, () => setShowStatusSuccess(false));
    useCloseOnOutsideAndEscape(
        openMarkMenuId !== null,
        markMenuRef,
        () => setOpenMarkMenuId(null),
    );

    const statusPills = [
        {
            key: "Open",
            label: "Open",
            image: openImage,
            alt: "Open issues",
            count: statusCounts.Open,
            className: "status-pill--open",
        },
        {
            key: "In Progress",
            label: "In Progress",
            image: inProgressImage,
            alt: "In progress issues",
            count: statusCounts["In Progress"],
            className: "status-pill--progress",
        },
        {
            key: "Resolved",
            label: "Resolved",
            image: resolvedImage,
            alt: "Resolved issues",
            count: statusCounts.Resolved,
            className: "status-pill--resolved",
        },
    ];

    // Reset all filters to default values
    const resetFilters = () => {
        setQuery("");
        setStatusFilter("All");
        setPriorityFilter("All");
        setSeverityFilter("All");
    };

    const handleViewIssue = async (issueId: string) => {
        const cachedIssue = issues.find((issue) => issue.id === issueId) || null;
        setViewIssueId(issueId);
        setViewIssue(cachedIssue);
        setViewError("");
        setIsViewLoading(true);

        try {
            const issue = await getIssueById(issueId);
            setViewIssue(issue);
        } catch {
            setViewError("Unable to load issue details.");
        } finally {
            setIsViewLoading(false);
        }
    };

    const closeViewPopup = () => {
        setViewIssueId(null);
        setViewIssue(null);
        setViewError("");
        setIsViewLoading(false);
    };

    // Request the status change of an issue
    const requestStatusChange = (issueId: string, status: IssueStatus) => {
        setStatusTargetId(issueId);
        setStatusTargetValue(status);
    };

    // Cancel status change
    const cancelStatusChange = () => {
        setStatusTargetId(null);
        setStatusTargetValue(null);
    };

    // Confirm status change
    const confirmStatusChange = async () => {
        if (!statusTargetId || !statusTargetValue) {
            return;
        }

        try {
            const updatedIssue = await updateIssueStatus(
                statusTargetId,
                statusTargetValue,
            );
            setIssues((current) =>
                current.map((issue) =>
                    issue.id === statusTargetId ? updatedIssue : issue,
                ),
            );
            setStatusTargetId(null);
            setStatusTargetValue(null);
            setStatusSuccessMessage(
                statusTargetValue === "Resolved"
                    ? "Issue resolved successfully."
                    : "Issue moved to in progress.",
            );
            setShowStatusSuccess(true);
        } catch {

        }
    };

    //Handle delete button click by setting the target issue 
    const handleDeleteIssue = (issueId: string) => {
        setDeleteTargetId(issueId);
    };

    // Confirm deletion
    const confirmDelete = async () => {
        if (!deleteTargetId) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteIssue(deleteTargetId);
            setIssues((current) =>
                current.filter((issue) => issue.id !== deleteTargetId),
            );
            setDeleteTargetId(null);
            setShowDeleteSuccess(true);
        } catch {

        } finally {
            setIsDeleting(false);
        }
    };

    // Cancel deletion
    const cancelDelete = () => {
        if (!isDeleting) {
            setDeleteTargetId(null);
        }
    };

    // Handle logout by clearing local storage and navigating to login page
    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

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
                            onClick={() => navigate("/issues/new")}
                        >
                            Create issue
                        </button>
                    </div>
                </header>

                <section className="panel status-overview">
                    <h2>Status Overview</h2>
                    <div className="status-pills">
                        {statusPills.map((pill) => (
                            <div
                                key={pill.key}
                                className={`status-pill ${pill.className}`}
                            >
                                <span className="status-pill__icon" aria-hidden="true">
                                    <img
                                        className="status-pill__image"
                                        src={pill.image}
                                        alt={pill.alt}
                                    />
                                </span>
                                <span className="status-pill__label">{pill.label}</span>
                                <span className="status-pill__count">{pill.count}</span>
                            </div>
                        ))}
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
                                    .replace(" ", "-")}`}
                            >
                                <div className="issue-card__header">
                                    <div>
                                        <h3>{issue.title}</h3>
                                    </div>
                                </div>
                                <div className="issue-card__meta">
                                    <span
                                        className={`badge badge--status badge--${issue.status
                                            .toLowerCase()
                                            .replace(" ", "-")}`}
                                    >
                                        {issue.status}
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
                                            onClick={() => handleViewIssue(issue.id)}
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
                                        <div
                                            className="mark-menu"
                                            ref={openMarkMenuId === issue.id ? markMenuRef : null}
                                        >
                                            <button
                                                className="icon-button mark-menu__button"
                                                type="button"
                                                aria-haspopup="menu"
                                                aria-expanded={openMarkMenuId === issue.id}
                                                onClick={() =>
                                                    setOpenMarkMenuId((current) =>
                                                        current === issue.id ? null : issue.id,
                                                    )
                                                }
                                            >
                                                <span>Mark as</span>
                                                <span className="mark-menu__caret" aria-hidden="true" />
                                            </button>
                                            {openMarkMenuId === issue.id && (
                                                <div className="mark-menu__list" role="menu">
                                                    <button
                                                        className="mark-menu__item"
                                                        type="button"
                                                        role="menuitem"
                                                        disabled={issue.status === "In Progress"}
                                                        onClick={() => {
                                                            setOpenMarkMenuId(null);
                                                            requestStatusChange(issue.id, "In Progress");
                                                        }}
                                                    >
                                                        In progress
                                                    </button>
                                                    <button
                                                        className="mark-menu__item"
                                                        type="button"
                                                        role="menuitem"
                                                        disabled={issue.status === "Resolved"}
                                                        onClick={() => {
                                                            setOpenMarkMenuId(null);
                                                            requestStatusChange(issue.id, "Resolved");
                                                        }}
                                                    >
                                                        Resolved
                                                    </button>
                                                </div>
                                            )}
                                        </div>
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

            </div>

            <IssueDetailsPopup
                open={viewIssueId !== null}
                issue={viewIssue}
                loading={isViewLoading}
                error={viewError}
                onClose={closeViewPopup}
                formatDate={formatDate}
            />

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

            <ConfirmPopup
                open={statusTargetId !== null && statusTargetValue !== null}
                title="Update status"
                message={
                    statusTargetValue === "Resolved"
                        ? "Mark this issue as resolved?"
                        : "Move this issue to in progress?"
                }
                confirmText="Yes"
                cancelText="No"
                onConfirm={confirmStatusChange}
                onCancel={cancelStatusChange}
            />

            {showDeleteSuccess && <Toast message="Issue deleted successfully." />}

            {showStatusSuccess && <Toast message={statusSuccessMessage} />}
        </div>
    );
}

export default Dashboard;
