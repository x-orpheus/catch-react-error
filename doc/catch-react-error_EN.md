# catch-react-error

> The participants of project are [Zhang Weidong](https://github.com/xff1874) and [Zhao Xiangtao](https://sylvenas.github.io/)

## A bug-caused case

A well-known Korean men’s popping group has previously released a famous digital album on our platform. However, some fans report that the page crashed when loading. The problem is just one line `jsx` code.

```jsx {8}
  render () {
     const { data } = this.props;
     const { creator } = data;
     let getUserIcon = (obj) => {
         if (obj.userType == 4) {
             return (<i className = "icn u-svg u-svg-yyr_sml" />);
         } else if (obj.authStatus == 1) {
             return (<i className = "icn u-svg u-svg-vip_sml" />);
         } else if (obj.expertTags && creator.expertTags.length> 0) {
             return (<i className = "icn u-svg u-svg-daren_sml" />);
         }
         return null;
     };
     ...
  }
```

The **creator** in this line `if (obj.expertTags && creator.expertTags.length)` should be **obj**. The accident was made by mistake.

We all use `lint` tools like `eslint` to protect our source code. However, in above situation, the **creator** is used at other place. It's hard to detect the bug as it's a logical problem.

As a result, we fixed the `bug` immediately and made the aplogoies. It make me thinking **How to prevent this accident from happening again**.

For such bug, it is hard to find at compile time or runtime. So, we should catch such bug and display an fallback section when the accident happens.

## ErrorBoundary

The react team import the `ErrorBoundary` component since React 16, which are components that **catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI**

This feature light our road。However, `Error Boundary` has limits below:

- Event handlers (e.g. onClick, onMouseEnter)
- Asynchronous code (such as requestAnimationFrame, setTimeout, promise)
- Server-side rendering
- ErrorBoundary The error of the component itself.

### How to create an ErrorBoundary Component

It is really simple to create `ErrorBoundary` component. All you have to do is adding `static getDerivedStateFromError ()` or `componentDidCatch ()` in the your raw react component.

[The official example](https://reactjs.org/docs/error-boundaries.html) is <span id="jump">below</span>:

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1> Something went wrong. </h1>;
    }

    return this.props.children;
  }
}
```

The `getDerivedStateFromError` function catches the error, and sets the `hasError` variable.

The `render` function display fallback ui `<h1> Something went wrong. </h1>` when the thing goes wrong .

Then wrap your souce code like this.

```jsx
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

### Common usage of ErrorBoundary.

It is really popular to create an `ErrorBoundaryHOC` component and wrap the target,such is `scratch` example.

```jsx
export default errorBoundaryHOC("Blocks")(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Blocks)
);
```

However,there are so many export usage.

```js
export class ClassName {...}
export {name1, name2,…, nameN};
export {variable1 as name1, variable2 as name2,…, nameN};
export * as name1 from…
```

This rises 2 questions

- It is hard to modify the old the ource code as so many export types

- Adding and removing HOC is a heavy workload and very error-prone.

So, we need to find a simple solution to fix the trouble.

## Bronze Age - BabelPlugin

After encountering the above `HOC` problem, we are thinkging whether we can wrap an `ErrorBoundary` component directly in the children components.

<div style="text-align:center" align="center">
  <img src ="https://p1.music.126.net/CmbPWqDH3xZ198OFWb6JBQ==/109951164546488873.png" height="400">
</div>

The summary is below:

1. Determine if it is the React16 version
2. Read configuration file
3. Checks whether the ErrorBoundary component is wrapped. If not, follow the patch process. If so, determine whether to repackage it based on the force parameters.
4. path process:

> a. import the ErrorBoundary component

> b. wrap children

The configuration file is as follows (.catch-react-error-config.json):

```json
{
  "sentinel": {
    "imports": "import ServerErrorBoundary from '$ components / ServerErrorBoundary'",
    "errorHandleComponent": "ServerErrorBoundary",
    "filter": ["/ actual /"]
  },
  "sourceDir": "test / fixtures / wrapCustomComponent"
}
```

**source code before patch**

```jsx
import React, { Component } from "react";

class App extends Component {
  render() {
    return <CustomComponent />;
  }
}
```

**source code after patch**:

```jsx
// isCatchReactError
import ServerErrorBoundary from "$ components / ServerErrorBoundary";
import React, { Component } from "react";

class App extends Component {
  render() {
    return (
      <ServerErrorBoundary isCatchReactError>
                {<CustomComponent />}
              
      </ServerErrorBoundary>
    );
  }
}
```

The is two sentences `import ServerErrorBoundary from '$ components / ServerErrorBoundary'` in the header.

Then the entire component is also wrapped by `ServerErrorBoundary`,

`isCatchReactError` is an placeholder to tell if we patch it previous.

The idea heaily realys on the [babel plugin](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md).

The main source code is below:

```js
const babelTemplate = require ("@ babel / template");
const t = require ("babel-types");

const visitor = {
  Program: {
    // Import ErrorBoundary at the beginning of the file
    exit (path) {
      // string code is converted to AST
      const impstm = template.default.ast (
        "import ErrorBoundary from '$ components / ErrorBoundary'"
      );
      path.node.body.unshift (impstm);
    }
  },

  // Wrap return jsxElement
  ReturnStatement (path) {
    const parentFunc = path.getFunctionParent ();
    const oldJsx = path.node.argument;
    if (
      ! oldJsx ||
      ((! parentFunc.node.key || parentFunc.node.key.name! == "render") &&
        oldJsx.type! == "JSXElement")
    ) {
      return;
    }

// Create the component tree wrapped by ErrorBoundary
    const openingElement = t.JSXOpeningElement (
      t.JSXIdentifier ("ErrorBoundary")
    );
    const closingElement = t.JSXClosingElement (
      t.JSXIdentifier ("ErrorBoundary")
    );
    const newJsx = t.JSXElement (openingElement, closingElement, oldJsx);

    // insert new jxsElement and delete old
    let newReturnStm = t.returnStatement (newJsx);
    path.remove ();
    path.parent.body.push (newReturnStm);
  }
};
```

The above code aim to wrap the children components by custom component which happens to be the `ErrorBoundary` component。

You can wrap your children component with any other component.

The complete source code is [here](https://github.com/xff1874/react-error-sentinel)

It also need to modify your webpack configuration file.
As a result , it is still not a elegant solution.

## Golden Age-TS Decorator

The typescript provides an concise solution to handle the problem with `decorator`

It provides `class decorators`, `method decorators`, `accessor decorators`, `attribute decorators`, `parameter decorators`, see the [official website](https://www.tslang.cn/docs/handbook/decorators.html) for more details。

We can create a class decorator and use it like this:

```jsx
@catchreacterror()
class Count extends React.Component {
  render() {
    const { count } = this.props;
    if (count === 3) {
      throw new Error("count is three");
    }
    return <h1>{count}</h1>;
  }
}
```

The parameter of the `catchreacterror` function is the an error boundary component which the default value is `DefaultErrorBoundary` component

The `catchreacterror` core code is something as follow:

```jsx
import React, { Component, forwardRef } from "react";

const catchreacterror = (Boundary = DefaultErrorBoundary) => InnerComponent => {
  class WrapperComponent extends Component {
    render() {
      const { forwardedRef } = this.props;
      return (
        <Boundary>
             
          <InnerComponent {...this.props} ref={forwardedRef} /> 
        </Boundary>
      );
    }
  }
};
```

The return value is a High-Order-Function, and the child component is wrapped with error boundary component.

`catchreacterror` is essentially a curried function with a signature:

```
catchreacterror :: ErrorBoundary-> Function-> Component
```

### Server-side rendering error capture

The official `ErrorBoundary` does not support SSR. So we use `try-catch` to handle such case:

1. First tell if it is server side by is_server function

```js
function is_server () {
  return! (typeof window! == "undefined" && window.document);
}
```

2. try catch to wrap

```js
if (is_server()) {
  const originalRender = InnerComponent.prototype.render;

  InnerComponent.prototype.render = function() {
    try {
      return originalRender.apply(this, arguments);
    } catch (error) {
      console.error(error);
      return <div> Something is Wrong </div>;
    }
  };
}
```

The below is instruction to tell you how to use catch-react-error library in your project.

## How to use catch-react-error

Please visit our webisite [catch-react-error](https://github.com/x-orpheus/catch-react-error) to find more details
