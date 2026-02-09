import type { Issue } from "../constants/issues";

type IssueDetailsPopupProps = {
    open: boolean;
    issue: Issue | null;
    loading: boolean;
    error: string;
    onClose: () => void;
    formatDate: (value: string) => string;
};

function IssueDetailsPopup({
    open,
    issue,
    loading,
    error,
    onClose,
    formatDate,
}: IssueDetailsPopupProps) {
    if (!open) {
        return null;
    }

    return (
        <div className="confirm-dialog-backdrop" role="presentation">
            <div
                className="issue-details-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="issue-details-title"
            >
                <div className="issue-details-dialog__header">
                    <div>
                        <h3 id="issue-details-title">Issue details</h3>
                        <p className="issue-details-dialog__subtitle">
                            A quick snapshot of everything about this issue
                        </p>
                    </div>
                    <button
                        className="ghost-button issue-details-dialog__close"
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                d="M6.2 5.2 12 11l5.8-5.8 1.4 1.4L13.4 12l5.8 5.8-1.4 1.4L12 13.4l-5.8 5.8-1.4-1.4L10.6 12 4.8 6.6Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>
                </div>

                {loading && !issue && (
                    <div className="issue-details-dialog__skeleton" aria-live="polite">
                        <div className="skeleton-line skeleton-line--title" />
                        <div className="skeleton-card" />
                        <div className="skeleton-card skeleton-card--grid" />
                    </div>
                )}

                {!loading && error && (
                    <p className="issue-details-dialog__error">{error}</p>
                )}

                {!loading && !error && issue && (
                    <div className="issue-details-dialog__content">
                        <div className="issue-details-dialog__title-row">
                            <h4 className="issue-details-dialog__title">{issue.title}</h4>
                            <span
                                className={`badge badge--status badge--${issue.status
                                    .toLowerCase()
                                    .replace(" ", "-")}`}
                            >
                                {issue.status}
                            </span>
                        </div>
                        <div className="issue-details-dialog__section">
                            <span className="issue-details-dialog__section-title">
                                Description
                            </span>
                            <p className="issue-details-dialog__description">
                                {issue.description}
                            </p>
                        </div>
                        <div className="issue-details-dialog__section">
                            <span className="issue-details-dialog__section-title">
                                Details
                            </span>
                            <div className="issue-details-dialog__grid">
                                <div className="issue-details-dialog__row">
                                    <span className="issue-details-dialog__label">
                                        Priority
                                    </span>
                                    <span className="issue-details-dialog__value">
                                        {issue.priority}
                                    </span>
                                </div>
                                <div className="issue-details-dialog__row">
                                    <span className="issue-details-dialog__label">
                                        Severity
                                    </span>
                                    <span className="issue-details-dialog__value">
                                        {issue.severity}
                                    </span>
                                </div>
                                <div className="issue-details-dialog__row">
                                    <span className="issue-details-dialog__label">
                                        Created
                                    </span>
                                    <span className="issue-details-dialog__value">
                                        {formatDate(issue.createdAt)}
                                    </span>
                                </div>
                                {issue.status === "Resolved" && (
                                    <div className="issue-details-dialog__row">
                                        <span className="issue-details-dialog__label">
                                            Resolved
                                        </span>
                                        <span className="issue-details-dialog__value">
                                            {formatDate(issue.updatedAt)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default IssueDetailsPopup;
