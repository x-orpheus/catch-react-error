import * as React from 'react';
// import { renderToStaticMarkup } from 'react-dom/server';

import { ErrorBoundaryProps, ErrorBoundaryState } from '../../interface/propsInterface'

export function serverMarkup(props: ErrorBoundaryProps): React.ReactNode {
    const element = props.children;

    try {
        // const staticMarkup = renderToStaticMarkup(element as React.ReactElement);
        return element;
    } catch (e) {
        return props.fallback(e)
    }
}

export function is_server(): boolean {
    return !(typeof window !== 'undefined' && window.document);
}

export class IsomorphicErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {

    static defaultProps = {
        fallback: () => <div>Loading</div>,
        type: 'i'
    }

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
        if (is_server()) {
            return serverMarkup(this.props);
        }

        if (this.state.hasError) {
            return this.props.fallback(this.state.err);
        }

        return this.props.children;
    }
}
export default IsomorphicErrorBoundary;
