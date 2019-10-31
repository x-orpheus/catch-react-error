export interface ErrorBoundaryProps {
    fallback?: (err?: Error) => React.ReactNode;
    type?: string,
    children: React.ReactNode
}

export interface ErrorBoundaryState {
    hasError: boolean,
    err?: Error | undefined
}