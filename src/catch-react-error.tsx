import * as React from 'react';
import { Component, ComponentClass, FunctionComponent, forwardRef, Ref, ReactNode } from 'react';
import DefaultErrorBoundary from './components/DefaultErrorBoundary'
import { ErrorBoundaryProps, ErrorBoundaryState } from './interface/propsInterface'
import { is_server, isComponentClass } from './util/index';

const catchreacterror =
    (Boundary: ComponentClass<ErrorBoundaryProps, ErrorBoundaryState> = DefaultErrorBoundary) =>
        (InnerComponent: ComponentClass | FunctionComponent) => {

            if (Boundary && !Boundary.prototype.isReactComponent) {
                console.warn(`The ${Boundary} component is not a react component`);
                Boundary = DefaultErrorBoundary
            }
            if (Boundary && !(Boundary.prototype.componentDidCatch || Boundary.prototype.getDerivedStateFromError)) {
                console.warn(`${Boundary} doesn't has componentDidCatch or getDerivedStateFromError`);
                Boundary = DefaultErrorBoundary
            }

            if (isComponentClass(InnerComponent)) {

                type ComposedComponentInstance =
                    InstanceType<typeof InnerComponent>

                type ComponnetProps = {
                    forwardedRef?: Ref<ComposedComponentInstance>
                    children?: ReactNode;
                }
                if (is_server()) {
                    const originalRender = InnerComponent.prototype.render

                    InnerComponent.prototype.render = function () {
                        try {
                            return originalRender.apply(this, arguments);
                        } catch (error) {
                            console.error(error)
                            return null
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

            } else {
                if (is_server()) {
                    const originalFun = InnerComponent;
                    InnerComponent = function () {
                        try {
                            return originalFun.apply(null, arguments);
                        } catch (error) {
                            console.error(error)
                            return null
                        }
                    }
                }

                type ComponnetProps = {
                    children?: ReactNode;
                }

                return (props: ComponnetProps) => (
                    <Boundary >
                        <InnerComponent {...props} />
                    </Boundary>
                )
            }
        }

export default catchreacterror