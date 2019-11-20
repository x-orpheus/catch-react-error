export interface ErrorBoundaryProps {
    fallback: (err?: Error) => React.ReactNode;
    children: React.ReactNode
}

export interface ComponentProps {
    fallback?: (err?: Error) => React.ReactNode;
}


export interface ErrorBoundaryState {
    hasError: boolean,
    err?: Error | undefined
}