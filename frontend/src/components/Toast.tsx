import '../styles/Toast.css'

type ToastProps = {
    message: string
}

// Toast message container
function Toast({ message }: ToastProps) {
    return (
        <div className="toast" role="status" aria-live="polite">
            <span className="toast__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                        d="M9.6 16.2 5.9 12.5l1.6-1.6 2.1 2.1 6-6 1.6 1.6-7.6 7.6Z"
                        fill="currentColor"
                    />
                </svg>
            </span>
            <span className="toast__text">{message}</span>
        </div>
    )
}

export default Toast
