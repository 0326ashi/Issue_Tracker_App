import type { ReactNode } from 'react'

type AuthLayoutProps = {
  children: ReactNode
  className?: string
}


// Layout component for authentication pages with side panel
function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className={["auth-shell", className].filter(Boolean).join(' ')}>
      <aside className="auth-hero">
        <div className="hero-content">
          <p className="hero-kicker">Issue Tracker</p>
          <h1 className="hero-title">
            Track, manage, and resolve issues in one place.
          </h1>
          <p className="hero-subtitle">
            Keep projects clear, teams aligned, and releases on schedule.
          </p>
        </div>
        <div className="hero-orbit" aria-hidden="true" />
      </aside>

      <main className="auth-panel">{children}</main>
    </div>
  )
}

export default AuthLayout
