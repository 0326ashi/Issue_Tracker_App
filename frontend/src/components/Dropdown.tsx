import { useEffect, useRef, useState } from 'react'
import '../styles/Dropdown.css'

//Dropdown component with accessibility features and outside click handling
type DropdownOption<T extends string> = {
    value: T
    label: string
}

// Props for the Dropdown component, including label, current value, options, and change handler
type DropdownProps<T extends string> = {
    label: string
    value: T | ''
    options: Array<DropdownOption<T>>
    onChange: (value: T) => void
    placeholder?: string
    allowClear?: boolean
    onClear?: () => void
}

function Dropdown<T extends string>({
    label,
    value,
    options,
    onChange,
    placeholder,
    allowClear,
    onClear,
}: DropdownProps<T>) {
    const [isOpen, setIsOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!isOpen) {
            return undefined
        }

        // Close the dropdown when clicking outside
        const handleOutsideClick = (event: MouseEvent) => {
            if (!wrapperRef.current?.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        // Close the dropdown when pressing the Escape key
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleOutsideClick)
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen])

    const activeOption = options.find((option) => option.value === value)
    const displayValue = activeOption?.label ?? placeholder ?? ''

    // Render the dropdown
    return (
        <div className="dropdown" ref={wrapperRef}>
            <button
                type="button"
                className="dropdown__button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label={label}
                onClick={() => setIsOpen((current) => !current)}
            >
                <span className="dropdown__value">{displayValue}</span>
                <span className="dropdown__caret" aria-hidden="true" />
            </button>
            {allowClear && value !== '' && onClear && (
                <button
                    type="button"
                    className="dropdown__clear"
                    aria-label={`Clear ${label}`}
                    onMouseDown={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                    }}
                    onClick={(event) => {
                        event.stopPropagation()
                        onClear()
                    }}
                >
                    <span aria-hidden="true">×</span>
                </button>
            )}
            {isOpen && (
                <div
                    className="dropdown__menu"
                    role="listbox"
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={(event) => event.stopPropagation()}
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`dropdown__option${option.value === value ? ' dropdown__option--active' : ''}`}
                            role="option"
                            aria-selected={option.value === value}
                            onMouseDown={(event) => {
                                event.preventDefault()
                                event.stopPropagation()
                            }}
                            onClick={() => {
                                onChange(option.value)
                                setIsOpen(false)
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Dropdown
