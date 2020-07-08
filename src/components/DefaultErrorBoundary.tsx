import * as React from 'react';
import { ErrorBoundaryProps, ErrorBoundaryState } from '../interface/propsInterface'

export class DefaultErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {

    readonly state: Readonly<ErrorBoundaryState> = {
        hasError: false,
    };

    static getDerivedStateFromError(err: Error) {
        return {
            hasError: true,
            err
        };
    }

    componentDidCatch(err: Error, info: React.ErrorInfo) {
        console.log(err, info);
    }

    render() {

        if (this.state.hasError) {
            return null
        }

        return this.props.children;
    }
}
export default DefaultErrorBoundary;
