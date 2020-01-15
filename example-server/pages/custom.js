import React, { Component } from "react";
export class CustomErrorBoundary extends Component {
  state = {
    hasError: false
  };
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
