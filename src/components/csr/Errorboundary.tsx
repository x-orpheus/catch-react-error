import * as React from 'react';

import { ErrorBoundaryProps, ErrorBoundaryState } from '../../interface/propsInterface'

export class CSRErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {

    static defaultProps = {
        fallback: () => <div>Something went Wrong</div>,
        type: 'client'
    }

    readonly state = {
        hasError: false,
        err: new Error(),
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
