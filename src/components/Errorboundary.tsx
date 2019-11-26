import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ErrorBoundaryProps, ErrorBoundaryState } from '../interface/propsInterface'

export function serverMarkup(props: ErrorBoundaryProps): React.ReactNode {
    const element = props.children;

    try {
        return element;
    } catch (e) {
        return <div>Something is Wrong</div>
    }

}

export function is_server(): boolean {
    return !(typeof window !== 'undefined' && window.document);
}

export class IsomorphicErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {

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
<<<<<<< HEAD
            return <div>Something went Wrong</div>
=======
            return <div>Something is Wrong</div>
>>>>>>> f690a333b04079c4693583cf370b402c220be4f6
        }

        return this.props.children;
    }
}
export default IsomorphicErrorBoundary;
