import * as React from "react";
export class CustomErrorBoundary extends React.Component {
  state = {
    hasError: false
  };
  static catchreacterror = true;
  static getDerivedStateFromError(err) {
    return {
      hasError: true,
      err
    };
  }
  componentDidCatch(err, info) {
    console.log(err, info);
  }

  render() {
    if (this.state.hasError) {
      return <div>custom error boundary fallui</div>;
    }
    return this.props.children;
  }
}
export default CustomErrorBoundary;
