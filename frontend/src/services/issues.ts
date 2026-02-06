import type { Issue, IssuePriority, IssueSeverity } from '../constants/issues'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type IssueResponse = {
    issue: Issue
}

type IssueListResponse = {
    issues: Issue[]
}

type IssueError = {
    message: string
}

const handleResponse = async <T extends object>(response: Response): Promise<T> => {
    const data = (await response.json()) as T | IssueError

    if (!response.ok) {
        const errorMessage =
            'message' in data ? data.message : 'Something went wrong.'
        throw new Error(errorMessage)
    }

    return data as T
}

export const createIssue = async (payload: {
    title: string
    description: string
    priority: IssuePriority
    severity: IssueSeverity
}): Promise<Issue> => {
    const response = await fetch(`${API_URL}/api/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })

    const data = await handleResponse<IssueResponse>(response)
    return data.issue
}

export const getIssues = async (): Promise<Issue[]> => {
    const response = await fetch(`${API_URL}/api/issues`)
    const data = await handleResponse<IssueListResponse>(response)
    return data.issues
}
