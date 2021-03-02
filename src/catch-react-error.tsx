import * as React from "react";
import {
  Component,
  ComponentClass,
  FunctionComponent,
  MemoExoticComponent,
  ComponentType,
  forwardRef,
  Ref,
  ReactNode,
} from "react";
import DefaultErrorBoundary from "./components/DefaultErrorBoundary";
import {
  ErrorBoundaryProps,
  ErrorBoundaryState,
} from "./interface/propsInterface";
import { is_server, isComponentClass, isReactMemo } from "./util/index";

const catchreacterror = (
  ErrorBoundary?: ComponentClass<ErrorBoundaryProps, ErrorBoundaryState> & {
    catchreacterror: boolean;
  },
  TargetComponent?: ComponentClass | FunctionComponent
) => {
  let Boundary: ComponentClass<ErrorBoundaryProps, ErrorBoundaryState>,
    InnerComponent: ComponentClass | FunctionComponent;
  if (ErrorBoundary.catchreacterror) {
    Boundary = ErrorBoundary;
    if (ErrorBoundary && !ErrorBoundary.prototype.isReactComponent) {
      console.warn(`The ${ErrorBoundary} component is not a react component`);
      Boundary = DefaultErrorBoundary;
    }
    if (
      ErrorBoundary &&
      !(
        ErrorBoundary.prototype.componentDidCatch ||
        ErrorBoundary.prototype.getDerivedStateFromError
      )
    ) {
      console.warn(
        `${ErrorBoundary} doesn't has componentDidCatch or getDerivedStateFromError`
      );
      Boundary = DefaultErrorBoundary;
    }

    if (TargetComponent) {
      return wrapComponent(Boundary)(TargetComponent);
    }
    return wrapComponent(Boundary);
  } else {
    Boundary = DefaultErrorBoundary;
    InnerComponent = ErrorBoundary;
    return wrapComponent(Boundary)(InnerComponent);
  }
};

const wrapComponent = (
  Boundary: ComponentClass<ErrorBoundaryProps, ErrorBoundaryState>
) => (InnerComponent: ComponentClass | FunctionComponent) => {
  {
    // 将React.memo包裹过的组件转换成普通函数式组件
    if (!isComponentClass(InnerComponent) && isReactMemo(InnerComponent)) {
      const NewComponent: MemoExoticComponent<
        ComponentType<any>
      > = InnerComponent;
      InnerComponent = function(props: { children?: ReactNode }) {
        return <NewComponent {...props} />;
      };
    }

    if (isComponentClass(InnerComponent)) {
      type ComposedComponentInstance = InstanceType<typeof InnerComponent>;

      type ComponnetProps = {
        forwardedRef?: Ref<ComposedComponentInstance>;
        children?: ReactNode;
      };
      if (is_server()) {
        const originalRender = InnerComponent.prototype.render;

        InnerComponent.prototype.render = function() {
          try {
            return originalRender.apply(this, arguments);
          } catch (error) {
            console.error(error);
            return null;
          }
        };
      }

      class WrapperComponent extends Component<ComponnetProps, {}> {
        render() {
          const { forwardedRef } = this.props;
          return (
            <Boundary>
              {isComponentClass(InnerComponent) ? (
                <InnerComponent {...this.props} ref={forwardedRef} />
              ) : (
                <InnerComponent {...this.props} />
              )}
            </Boundary>
          );
        }
      }

      return forwardRef<ComposedComponentInstance, ComponnetProps>(
        (props, ref) => <WrapperComponent forwardedRef={ref} {...props} />
      );
    } else {
      if (is_server()) {
        const originalFun = InnerComponent;
        InnerComponent = function() {
          try {
            return originalFun.apply(null, arguments);
          } catch (error) {
            console.error(error);
            return null;
          }
        };
      }

      type ComponnetProps = {
        children?: ReactNode;
      };

      return (props: ComponnetProps) => (
        <Boundary>
          <InnerComponent {...props} />
        </Boundary>
      );
    }
  }
};

export default catchreacterror;
