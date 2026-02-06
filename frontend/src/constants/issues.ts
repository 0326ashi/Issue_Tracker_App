//values for issue status
export const ISSUE_STATUS_OPTIONS = [
    'Open',
    'In Progress',
    'Resolved',
] as const

//values for issue priority
export const ISSUE_PRIORITY_OPTIONS = [
    'Low',
    'Medium',
    'High',
] as const

//values for issue severity
export const ISSUE_SEVERITY_OPTIONS = ['Minor', 'Major', 'Critical'] as const

//export types for issue status, priority, severity, and issue
export type IssueStatus = (typeof ISSUE_STATUS_OPTIONS)[number]
export type IssuePriority = (typeof ISSUE_PRIORITY_OPTIONS)[number]
export type IssueSeverity = (typeof ISSUE_SEVERITY_OPTIONS)[number]

export type Issue = {
    id: string
    title: string
    description: string
    status: IssueStatus
    priority: IssuePriority
    severity: IssueSeverity
    createdAt: string
}
