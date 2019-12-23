# catch-react-error

> This project is the front-end part of the stability project of the [Netease Cloud Music](https://music.163.com/) revenue group, with participants [Zhang Weidong](https://github.com/xff1874) and [Zhao Xiangtao](https://sylvenas.github.io/)

## A bug-caused case

A well-known Korean men’s popping group has previously put a heavy digital album on our platform. It was originally a good thing, and as a result, complaints swarmed after it was put on the shelves. Some user feedback said webpages crashed after opening. After an urgent investigation, we found that one line of code caused it. The following is this `jsx` code.

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

The **creator** in this line `if (obj.expertTags && creator.expertTags.length)` should be **obj**. Maybe because of slipping, I accidentally wrote it wrong.

In this case, the `lint` tool cannot detect it, because the **creator** happens to be a variable at the same time, which is a pure logical error.

As a result, we fixed the `bug` urgently, an official apology, and the relevant developers received corresponding penalties. Although things have stopped here, a voice has been echoing in my heart **How to prevent this accident from happening again**. For this kind of error, blocking can't be blocked, so we should think about designing a pocket mechanism that can isolate this error and make part of the page report an error instead of the entire webpage hanging up.

## ErrorBoundary

Beginning with React 16, the `ErrorBoundary` component was introduced, which can capture errors generated in its `children components`, record error logs, and display downgraded content, [specify official website addresses](https://reactjs.org/docs/error-boundaries.html).

> Error boundaries are React components that **catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI** instead of the component tree that crashed.

This feature brightens our eyes and inspires our spirit, as if we saw a ray of light in the dark. However, after research, we found that `Error Boundary` can only catch the `render` errors of the child components, which has certain limitations. The following errors cannot be handled:

- Event handlers (e.g. onClick, onMouseEnter)
- Asynchronous code (such as requestAnimationFrame, setTimeout, promise)
- Server-side rendering
- ErrorBoundary The error of the component itself.

### How to create an ErrorBoundary Component

Just add `static getDerivedStateFromError ()` or `componentDidCatch ()` in the `component`. The former is downgraded when an error occurs, and the latter function is mainly for logging. [The official code](https://reactjs.org/docs/error-boundaries.html)is as follows:

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

You can see that `getDerivedStateFromError` catches the error, and then sets the `hasError` variable. The `render` function returns the degraded processing based on the value of the variable `<h1> Something went wrong. </h1>` .

At this point, an `ErrorBoundary`component has been defined, you only need to wrap a child component when using it:

```jsx
<ErrorBoundary>
    
  <MyWidget />
</ErrorBoundary>
```

### Common usage of ErrorBoundary.

After seeing the usage method of `ErrorBoundary`, the usage of most teams is to write a `HOC` and then wrap it, such as the usage of `scratch` below

```jsx
export default errorBoundaryHOC("Blocks")(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Blocks)
);
```

But there are many formats for export

```js
export class ClassName {...}
export {name1, name2,…, nameN};
export {variable1 as name1, variable2 as name2,…, nameN};
export * as name1 from…
```

This brings 2 questions

- It is inconvenient to modify the stock code, and sometimes it is necessary to modify the component structure.

- Adding and removing HOC is a heavy workload and very error-prone

Therefore, we are considering whether there is a way to deal with the above problems more conveniently.

## Bronze Age - BabelPlugin

After encountering the above `HOC` problem, we focused on whether we can wrap an `ErrorBoundary` component directly in the subcomponent. The flow diagram is as follows:

<div style="text-align:center" align="center">
  <img src ="https://p1.music.126.net/CmbPWqDH3xZ198OFWb6JBQ==/109951164546488873.png" height="400">
</div>

The simple idea is as follows:

- 1.Determine if it is the React16 version
- 2.Read configuration file
- 3.Checks whether the ErrorBoundary component is wrapped. If not, follow the patch process. If so, determine whether to repackage it based on the force tag.
- 4.path process:

> a. First introduce the ErrorBoundary component

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

**The code after reading the configuration file patch is**:

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

You can see that there is more `import ServerErrorBoundary from '$ components / ServerErrorBoundary'` in the header.

Then the entire component is also wrapped by `ServerErrorBoundary`,

`isCatchReactError` is used to mark the bit, which is mainly used to update the corresponding bit in the next patch to prevent it from being introduced multiple times.

The idea is mainly through the [babel plugin](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md), which automatically imports ErrorBoundary and compiles components in batches during code compilation.

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

The idea of ​​this method is to wrap the existing code with the `sentinel.imports` statement in the configuration file.

But this `imports` happens to be an `Errorboundary`, in addition to this, you can also inject other such as `imports` is a `LogComponent` and so on.

The complete github code is implemented [here](https://github.com/xff1874/react-error-sentinel)

Although this method implements the error capture and pocketing scheme, it is very complicated and cumbersome to use. You need to configure `webpack` and `.catch-react-error-config.json` and run the scaffolding.

## Golden Age-TS Decorator

After the above solution came out, I could not find an elegant solution for a long time, either it was too difficult to use (babelplugin), or the source code was changed too much (HOC). Is there a way to combine the two until the To the `TypeScript decorator`.

TS provides `class decorators`, `method decorators`, `accessor decorators`, `attribute decorators`, `parameter decorators`, see the [official website](https://www.tslang.cn/docs/handbook/decorators.html) for details about decorators.

We use a class decorator, and the error trap design is as follows：

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

The parameter of the `catchreacterror` function is the `ErrorBoundary` component. The user can use a custom `ErrorBoundary`, or use the default `DefaultErrorBoundary` component if it is not passed;

The `catchreacterror` core code is as follows:

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

The return value is a High-Order-Function, and the child component is wrapped with `ErrorBoundary`.

`catchreacterror` is essentially a curried function with a signature:

```
catchreacterror :: ErrorBoundary-> Function-> Component
```

### Server-side rendering error capture

For server-side rendering, the official `ErrorBoundary` does not support it, but many programs now use this solution, including our own projects. So we wrapped it with `try-catch`:

1.First determine whether it is the server is_server

```js
function is_server () {
  return! (typeof window! == "undefined" && window.document);
}
```

2.package

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

## catch-react-error usage

### 1.install catch-react-error

```sh
npm install catch-react-error --save
```

### 2. Install ES7 Decorator babel plugin

We use ES7's Decorator syntax to make the code more concise, of course, you can also use the functional style.

```sh
npm install --save-dev @ babel / plugin-proposal-decorators
npm install --save-dev @ babel / plugin-proposal-class-properties
```

Add babel plugin

```json
{
  "plugins": [
    ["@ babel / plugin-proposal-decorators", { "legacy": true }],
    ["@ babel / plugin-proposal-class-properties", { "loose": true }]
  ]
}
```

### 3. import catch-react-error

```jsx
import catchreacterror from "catch-react-error";
```

### 4. Use @catchreacterror decorator

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

`catchreacterror` is essentially a curried function with a signature:

```
catchreacterror :: ErrorBoundary-> Function-> Component
```

The `catchreacterror` function accepts one parameter: ErrorBoundary (`DefaultErrorBoundary` is used by default) and returns a `High-Order-Function`.

The principle is: client-side rendering will use React 16's [Error Boundary](https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html) related functions to handle errors, and server-side use `try catch` to catch `render` errors.

### 5. Use @catchreacterror to handle FunctionComponent

The above is the processing for `ClassComponent`, but some people like to use function components, here are also provided methods of use, as follows.

```js
// If the Count component is not wrapped with catchreacterror,
// If count is 3, an error will be reported, causing the program to crash
function Count({ count }) {
  if (count === 3) {
    throw new Error("count is three");
  }
  return <h1>{count}</h1>;
}

// After being wrapped by catchreacterror, the error will be caught,
// Only cause the current component to be destroyed, and other content is displayed normally
const SaleCount = catchreacterror()(Count);

function App() {
  return (
    <div className="App">
            
      <SaleCount count={3} />
      <button>I'm OK, click me !</button>
    </div>
  );
}
```

### 6. How to write a CustomErrorBoundary

Copy the examples provided by React below, you can add logs and customize the fallback content

```jsx
class CustomErrorBoundary extends React. Component {
  constructor (props) {
    super (props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError (error) {
    // Update state so the next render will show the fallback UI.
    return {hasError: true};
  }

  componentDidCatch (error, errorInfo) {
    // You can also log the error to an error reporting service
    logErrorToMyService (error, errorInfo);
  }

  render () {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1> Something went wrong. </ h1>;
    }
  }

    return this.props.children;
  }
}
```

The complete github code is here [catch-react-error](https://github.com/x-orpheus/catch-react-error).
