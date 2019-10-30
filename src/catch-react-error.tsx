import * as React from 'react';
import CSRErrorBoundary from './components/csr/Errorboundary'
import { ErrorBoundaryProps } from './interface'

interface Component extends React.Component {
    fallback?: (err: Error, info: object) => React.ReactNode
}

const EmptyFunc = (): React.ReactNode => { return 'react component must render something' }
const FallbackFunc = (): React.ReactNode => <div>loading</div>

const catchreacterror =
    (type: string = 'client', Boundary: React.ComponentType<ErrorBoundaryProps> = CSRErrorBoundary) =>
        (traget: Component, key: string, descriptor: PropertyDescriptor) => {
            const originalRender = traget.render || EmptyFunc;
            const fallback = traget.fallback || FallbackFunc;
            descriptor.value = () => (
                <Boundary type={type} fallback={fallback} >
                    {originalRender()}
                </Boundary>
            )
        }

export default catchreacterror