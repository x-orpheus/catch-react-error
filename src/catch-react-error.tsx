import * as React from 'react';
import IsomorphicErrorBoundary from './components/Errorboundary'
import { ErrorBoundaryProps } from './interface/propsInterface'

interface Component extends React.Component {
    fallback?: (err: Error) => React.ReactNode
}

const EmptyFunc = (): React.ReactNode => 'React Component must render something'
const FallbackFunc = (): React.ReactNode => <div>Loading</div>

const catchreacterror =
    (Boundary: React.ComponentType<ErrorBoundaryProps> = IsomorphicErrorBoundary) => {

        if (Boundary && !React.Component.prototype.isPrototypeOf(Boundary.prototype)) {
            console.warn("Catch-React-Error: The <ErrorBoundary /> component doesn't extend React.Component.  ErrorBoundary must extends React.Component");
            Boundary = IsomorphicErrorBoundary
            return;
        }

        return (traget: Component, key: string, descriptor: PropertyDescriptor) => {
            const originalRender = traget.render || EmptyFunc;
            const fallback = traget.fallback || FallbackFunc;
            descriptor.value = () => (
                <Boundary fallback={fallback} >
                    {originalRender()}
                </Boundary>
            )
        }
    }

export default catchreacterror