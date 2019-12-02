import * as React from 'react';
import { Component, ComponentClass, forwardRef, Ref, ReactNode } from 'react';
import IsomorphicErrorBoundary from './components/Errorboundary'
import { ErrorBoundaryProps, ErrorBoundaryState } from './interface/propsInterface'

const catchreacterror =
    (Boundary: ComponentClass<ErrorBoundaryProps,ErrorBoundaryState> = IsomorphicErrorBoundary) =>
        (InnerComponent: ComponentClass) => {

            if (Boundary && !Component.prototype.isPrototypeOf(Boundary.prototype)) {
                console.warn("Catch-React-Error: The <ErrorBoundary /> component doesn't extend React.Component.  ErrorBoundary must extends React.Component");
                Boundary = IsomorphicErrorBoundary
            }
            if(Boundary && !Boundary.prototype.componentDidCatch){
                console.warn("Catch-React-Error: The <ErrorBoundary /> component doesn't have componentDidCatch lifecycle.  ErrorBoundary must have componentDidCatch lifecycle");
                Boundary = IsomorphicErrorBoundary
            }

            type ComposedComponentInstance = InstanceType<typeof InnerComponent>;

            type ComponnetProps={
                forwardedRef:Ref<ComposedComponentInstance> 
                children?: ReactNode; 
            }

            class WrapperComponent extends Component<ComponnetProps, {}>  {
                render() {
                    const {
                        forwardedRef,
                    } = this.props;
                    return (
                        <Boundary >
                            <InnerComponent {...this.props} ref={forwardedRef} />
                        </Boundary>
                    )
                }
            }

            return forwardRef<ComposedComponentInstance, ComponnetProps>(
                (props, ref) => <WrapperComponent forwardedRef={ref} {...props} />)
        }

export default catchreacterror