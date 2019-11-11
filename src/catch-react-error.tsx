import * as React from 'react';
import CSRErrorBoundary from './components/csr/Errorboundary'
import IsomorphicErrorBoundary from './components/iso/Errorboundary'
import { ErrorBoundaryProps } from './interface/propsInterface'

interface Component extends React.Component {
    fallback?: (err: Error) => React.ReactNode
}

const EmptyFunc = (): React.ReactNode => { return 'React component must render something' }
const FallbackFunc = (): React.ReactNode => <div>Loading</div>

const catchreacterror =
    (type: string = 'c', Boundary: React.ComponentType<ErrorBoundaryProps>) => {


        if (type !== 'c' && type !== 'i') {
            type = 'i'
            console.warn("The input parameter is wrong, so we will use the default isomporhpic error boundary")
        }

        if (Boundary && !React.Component.prototype.isPrototypeOf(Boundary.prototype)) {
            console.warn("Catch-React-Error: The <ErrorBoundary /> component doesn't extend React.Component.  ErrorBoundary must extends React.Component");
            return;
        }

        if (!Boundary) {
            type === 'c' ? Boundary = CSRErrorBoundary : IsomorphicErrorBoundary
        }

        return (traget: Component, key: string, descriptor: PropertyDescriptor) => {
            const originalRender = traget.render || EmptyFunc;
            const fallback = traget.fallback || FallbackFunc;
            descriptor.value = () => (
                <Boundary type={type} fallback={fallback} >
                    {originalRender()}
                </Boundary>
            )
        }
    }

export default catchreacterror