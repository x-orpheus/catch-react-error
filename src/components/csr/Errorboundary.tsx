import * as React from 'react';

import { ErrorBoundaryProps, ErrorBoundaryState } from '../../interface'

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {

    static defaultProps = {
        fallback: () => <div>loading</div>,
        type: 'client'
    }

    readonly state = {
        hasError: false,
    };

    static getDerivedStateFromError(err: Error) {
        return {
            hasError: true,
        };
    }

    componentDidCatch(err: Error, info: React.ErrorInfo) {
        console.log(err, info);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback()
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
