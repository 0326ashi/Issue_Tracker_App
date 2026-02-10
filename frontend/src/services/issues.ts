import type { Issue, IssuePriority, IssueSeverity, IssueStatus } from '../constants/issues'

const API_URL = "http://localhost:5000";

type IssueResponse = {
    issue: Issue
}

type IssueListResponse = {
    issues: Issue[]
}

type IssueError = {
    message: string
}

// Build auth headers when a token is available
const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('authToken')
    return token ? { Authorization: `Bearer ${token}` } : {}
}

// Helper function to handle API responses
const handleResponse = async <T extends object>(response: Response): Promise<T> => {
    const data = (await response.json()) as T | IssueError

    if (!response.ok) {
        const errorMessage =
            'message' in data ? data.message : 'Something went wrong.'
        throw new Error(errorMessage)
    }

    return data as T
}

// API call for creating a new issue
export const createIssue = async (payload: {
    title: string
    description: string
    priority: IssuePriority
    severity: IssueSeverity
}): Promise<Issue> => {
    const response = await fetch(`${API_URL}/api/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(payload),
    })

    const data = await handleResponse<IssueResponse>(response)
    return data.issue
}

// API call for fetching all issues
export const getIssues = async (): Promise<Issue[]> => {
    const response = await fetch(`${API_URL}/api/issues`, {
        headers: getAuthHeaders(),
    })
    const data = await handleResponse<IssueListResponse>(response)
    return data.issues
}

// API call for fetching a single issue by ID
export const getIssueById = async (issueId: string): Promise<Issue> => {
    const response = await fetch(`${API_URL}/api/issues/${issueId}`, {
        headers: getAuthHeaders(),
    })
    const data = await handleResponse<IssueResponse>(response)
    return data.issue
}

// API call for deleting an issue by ID
export const deleteIssue = async (issueId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/issues/${issueId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    })

    await handleResponse<{ message: string }>(response)
}

// API call for updating issue status
export const updateIssueStatus = async (
    issueId: string,
    status: IssueStatus,
): Promise<Issue> => {
    const response = await fetch(`${API_URL}/api/issues/${issueId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ status }),
    })

    const data = await handleResponse<IssueResponse>(response)
    return data.issue
}

// API call for updating issue status (separate endpoint for status edit)
export const updateIssueStatusEdit = async (
    issueId: string,
    status: IssueStatus,
): Promise<Issue> => {
    const response = await fetch(`${API_URL}/api/issues/${issueId}/statusedit`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ status }),
    })

    const data = await handleResponse<IssueResponse>(response)
    return data.issue
}

// API call for updating issue details
export const updateIssue = async (
    issueId: string,
    payload: {
        title: string
        description: string
        priority: IssuePriority
        severity: IssueSeverity
    },
): Promise<Issue> => {
    const response = await fetch(`${API_URL}/api/issues/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(payload),
    })

    const data = await handleResponse<IssueResponse>(response)
    return data.issue
}
