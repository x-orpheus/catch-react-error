import * as React from 'react';
import CSRErrorBoundary from './components/csr/Errorboundary'
import SSRErrorBoundary from './components/ssr/Errorboundary'
import { ErrorBoundaryProps } from './interface/propsInterface'

interface Component extends React.Component {
    fallback?: (err: Error, info: object) => React.ReactNode
}

const EmptyFunc = (): React.ReactNode => { return 'React component must render something' }
const FallbackFunc = (): React.ReactNode => <div>Something went Wrong</div>

const catchreacterror =
    (type: string, Boundary: React.ComponentType<ErrorBoundaryProps>) => {

        if (type !== 'client' && type !== 'server') {
            type = 'client'
            console.error("catchreacterror: type must be 'client' or 'server'")
        }

        if (Boundary && !React.Component.prototype.isPrototypeOf(Boundary.prototype)) {
            console.error("catchreacterror: ErrorBoundary must be 'React Class Component'")
        }

        if (!Boundary) {
            type === 'client' ? Boundary = CSRErrorBoundary : Boundary = SSRErrorBoundary
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