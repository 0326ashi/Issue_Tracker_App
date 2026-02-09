import type { ReactNode } from 'react'
import '../styles/ConfirmPopup.css'
import '../styles/Button.css'
type ConfirmPopupProps = {
    open: boolean
    title: string
    message: ReactNode
    confirmText?: string
    cancelText?: string
    confirmDisabled?: boolean
    onConfirm: () => void
    onCancel: () => void
}

// Reusable confirm modal for confirmation actions
function ConfirmPopup({
    open,
    title,
    message,
    confirmText = 'Yes',
    cancelText = 'No',
    confirmDisabled = false,
    onConfirm,
    onCancel,
}: ConfirmPopupProps) {
    if (!open) {
        return null
    }

    return (
        <div className="confirm-dialog-backdrop" role="presentation">
            <div
                className="confirm-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
            >
                <h3 id="confirm-dialog-title">{title}</h3>
                <p>{message}</p>
                <div className="confirm-dialog__actions">
                    <button
                        className="ghost-button"
                        type="button"
                        onClick={onCancel}
                        disabled={confirmDisabled}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="primary-button"
                        type="button"
                        onClick={onConfirm}
                        disabled={confirmDisabled}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmPopup
