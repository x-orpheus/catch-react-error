import * as React from 'react';

import { ErrorBoundaryProps, ErrorBoundaryState } from '../../interface/propsInterface'

export class CSRErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {

    static defaultProps = {
        fallback: () => <div>Loading</div>,
        type: 'c'
    }

    readonly state: Readonly<ErrorBoundaryState> = {
        hasError: false
    };

    static getDerivedStateFromError(err: Error) {
        return {
            hasError: true,
            err,
        };
    }

    componentDidCatch(err: Error, info: React.ErrorInfo) {
        console.log(err, info);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback(this.state.err)
        }

        return this.props.children;
    }
}

export default CSRErrorBoundary;
