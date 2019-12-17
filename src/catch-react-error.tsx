import * as React from 'react';
import { Component, ComponentClass, FunctionComponent, forwardRef, Ref, ReactNode } from 'react';
import IsomorphicErrorBoundary from './components/Errorboundary'
import { ErrorBoundaryProps, ErrorBoundaryState } from './interface/propsInterface'
import { is_server, isComponentClass } from './util/index';

const catchreacterror =
    (Boundary: ComponentClass<ErrorBoundaryProps, ErrorBoundaryState> = IsomorphicErrorBoundary) =>
        (InnerComponent: ComponentClass | FunctionComponent) => {

            if (Boundary && !Component.prototype.isPrototypeOf(Boundary.prototype)) {
                console.warn("Catch-React-Error: The <ErrorBoundary /> component doesn't extend React.Component.  ErrorBoundary must extends React.Component");
                Boundary = IsomorphicErrorBoundary
            }
            if (Boundary && !Boundary.prototype.componentDidCatch) {
                console.warn("Catch-React-Error: The <ErrorBoundary /> component doesn't have componentDidCatch lifecycle.  ErrorBoundary must have componentDidCatch lifecycle");
                Boundary = IsomorphicErrorBoundary
            }

            type ComposedComponentInstance =
                InstanceType<typeof InnerComponent>

            type ComponnetProps = {
                forwardedRef?: Ref<ComposedComponentInstance>
                children?: ReactNode;
            }
            if (is_server()) {
                if (isComponentClass(InnerComponent)) {
                    const originalRender = InnerComponent.prototype.render

                    InnerComponent.prototype.render = function () {
                        try {
                            return originalRender.apply(this, arguments);
                        } catch (error) {
                            console.error(error)
                            return <div>Something is Wrong</div>
                        }
                    }
                } else {
                    const originalFun = InnerComponent;
                    InnerComponent = function () {
                        try {
                            return originalFun.apply(null, arguments);
                        } catch (error) {
                            console.error(error)
                            return <div>Something is Wrong</div>
                        }
                    }
                }
            }

            class WrapperComponent extends Component<ComponnetProps, {}>  {
                render() {
                    const {
                        forwardedRef,
                    } = this.props;
                    return (
                        <Boundary >
                            {isComponentClass(InnerComponent) ?
                                <InnerComponent {...this.props} ref={forwardedRef} /> :
                                <InnerComponent {...this.props} />
                            }
                        </Boundary>
                    )
                }
            }

            return forwardRef<ComposedComponentInstance, ComponnetProps>(
                (props, ref) => <WrapperComponent forwardedRef={ref} {...props} />)
        }

export default catchreacterror