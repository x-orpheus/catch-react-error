export interface ErrorBoundaryProps {
    fallback?: (err?: Error, info?: React.ErrorInfo) => React.ReactNode;
    type?: string,
    children: React.ReactNode
}

export interface ErrorBoundaryState {
    hasError: boolean
}