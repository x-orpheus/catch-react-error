# catch-react-error

## ErrorBoundary

从 React 16 开始，没有被任何 ErrorBoundary 捕获的错误都将会导致[整个 React 组件树被销毁](https://reactjs.org/docs/error-boundaries.html#new-behavior-for-uncaught-errors)

ErrorBoundary 也属于 React 组件中的一种，这个组件可以用来捕获它的**子组件**中产生的错误，特有的`componentDidCatch`生命周期可以捕获子组件在渲染，生命周期以及构造函数内的错误，并记录错误日志；在错误发生时，可以展示一个错误提示或者`fallback`方案，以避免因为局部组件的错误进而整个组件树崩溃，导致页面白屏。

ErrorBoundary 翻译成汉语为错误边界，一方面，可以立即为这个组件是所有自组建发生错误的捕获者，类似于事件冒泡的机制，错误信息会被最近的 ErrorBoundary 捕获不在继续向上冒泡；所以这个组件局势错误的一个边界；另一方面可以理解为胡霍错误的能力是有边界的，并不是所有的错误都可以被捕获，那具体什么错误不能被捕获呢？

- Event Handlers [事件处理函数发生的错误](https://github.com/facebook/react/issues/11409)(e.g.,onClick,onMouseEnter)
- Asynchronous code [异步代码](https://github.com/facebook/react/issues/11334)(e.g.,requestAnimationFrame，setTimeout,promise)
- Server side rendering [服务端渲染]()
- Errors thrown in the error boundary itself (ErrorBoundary 组件本身发生了错误)

## 同构应用与 ErrorBoundary

现在主流的项目都会采用服务端渲染的方式，那么如果在服务端渲染的过程中发生了错误，不仅可能导致首屏白屏，还可能导致整体静态 HTML 的生成(包括相关 JS,CSS，服务端数据的插入等)，进而客户端 re-render 的时候也会白屏，所以我们必须寻找一个能够在同构应用中都可以处理错误的方式。

先看一下服务端渲染的原理，通过`react-dom/server`提供的`renderToStaticMarkup`方法，在 node.js 端把 React 组件转换为 HTML，然后把 HTML 直接发送到客户端，所以我们在服务端渲染的时候想要捕获 React 组件的错误，核心就是使用`try-catch`包裹处理`renderToStaticMarkup`方法了：

```js
function serverMarkup(props) {
  const element = props.children;
  try {
    const __html = renderToStaticMarkup(element);
    return <div dangerouslySetInnerHTML={{ __html }} />;
  } catch (e) {
    return <div>Something is Wrong</div>;
  }
}
```

如果是在客户端渲染的话，则不需要这么处理，直接使用 ErrorBoundary 组件包裹子组件即可，所以需要区别客户端和服务端：

```js
function is_server(): boolean {
  return !(typeof window !== "undefined" && window.document);
}
```

综合考虑了以上两点之后，就可以写出来可以用于同构应用的`IsomorphicErrorBoundary`:

```js
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

export class IsomorphicErrorBoundary extends React.Component {
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

  serverMarkup(props) {
    const element = props.children;
    try {
      const __html = renderToStaticMarkup(element);
      return <div dangerouslySetInnerHTML={{ __html }} />;
    } catch (e) {
      return <div>Something is Wrong</div>;
    }
  }

  is_server() {
    return !(typeof window !== "undefined" && window.document);
  }

  render() {
    if (this.is_server()) {
      return this.serverMarkup(this.props);
    }

    if (this.state.hasError) {
      return <div>Something is Wrong</div>;
    }

    return this.props.children;
  }
}
export default IsomorphicErrorBoundary;
```

## catch-react-eror decorator

上面实现了`IsomorphicErrorBoundary`之后，我们可以直接包装想要被`ErrorBoundary`包裹的组件了，使用起来和普通的`ErrorBoundary`并没有什么区别；不过这样代码侵入性比较强一点，可以借助 ES7 的`Decorator`来包裹一下组件，本质上来说，就是一个`Hight-Order-Component`，HOC 就要考虑传递 ref 的问题，这里借助`forwardRef`方法来传递 ref。

```js
import React, { Component, forwardRef } from "react";

const catchreacterror = (
  Boundary = IsomorphicErrorBoundary
) => InnerComponent => {
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

  return forwardRef((props, ref) => (
    <WrapperComponent forwardedRef={ref} {...props} />
  ));
};
```

`catchreacterror`函数的参数为`ErrorBoundary`组件,用户可以使用自定义的`ErrorBoundary`，如果不传递则使用默认的`IsomorphicErrorBoundary`组件；返回值为一个典型的`HOC`，使用`ErrorBoundary`包裹原组件，并传递`ref`。

### catch-react-error 使用方式

#### 1.安装 catch-react-error

```sh
nenpm install @music/catch-react-error
```

#### 2.安装 ES7 Decorator babel plugin

```sh
npm install --save-dev @babel/plugin-proposal-decorators
npm install --save-dev @babel/plugin-proposal-class-properties

```

添加 babel plugin

```json
{
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }]
  ]
}
```

#### 3.导入 catch-react-error

```jsx
import catchreacterror from "@music/catch-react-error";
```

#### 4.使用@catchreacterror decorator

```jsx
@catchreacterror()
class Test extends React.Component {
  render() {
    return <Button text="click me" />;
  }
}
```

`catchreacterror`函数接受一个参数:ErrorBoundary(不提供则默认采用`IsomorphicErrorBoundary`)

自定义的`CustomErrorBoundary`组件。默认会用框架提供的`IsomorphicErrorBoundary`组件。其原理为：客户端渲染会用 React 16 的[Error Boundary](https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html)的相关函数来处理错误，服务端用`try catch`来捕获 render 的错误。

#### 5.如何编写 CustomErrorBoundary

拷贝下面代码，修改成自己所需。

```js
class CustomErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  is_server() {
    return !(typeof window !== "undefined" && window.document);
  }
  handleServer(props) {
    const element = props.children;

    try {
      return element;
    } catch (e) {
      return "Something went wrong";
    }
  }

  render() {
    if (this.is_server()) {
      return this.handleServer(this.props);
    }
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

## 其他设计思路

### babel-plugin

通过[babel plugin](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md)的方式，在代码编译阶段自动导入 ErrorBoundary 并批量给组件包裹 ErrorBoundary,代码大致思路如下：

```js
const babelTemplate = require("@babel/template");
const t = require("babel-types");

const visitor = {
  Program: {
    // 在文件头部导入ErrorBoundary
    exit(path) {
      // string 代码转换为AST
      const impstm = template.default.ast(
        "import ErrorBoundary from '$components/ErrorBoundary'"
      );
      path.node.body.unshift(impstm);
    }
  },
  /**
   * 包裹return jsxElement
   * @param {*} path
   */
  ReturnStatement(path) {
    const parentFunc = path.getFunctionParent();
    const oldJsx = path.node.argument;
    if (
      !oldJsx ||
      ((!parentFunc.node.key || parentFunc.node.key.name !== "render") &&
        oldJsx.type !== "JSXElement")
    ) {
      return;
    }

    // 创建被ErrorBoundary包裹之后的组件树
    const openingElement = t.JSXOpeningElement(
      t.JSXIdentifier("ErrorBoundary")
    );
    const closingElement = t.JSXClosingElement(
      t.JSXIdentifier("ErrorBoundary")
    );
    const newJsx = t.JSXElement(openingElement, closingElement, oldJsx);

    // 插入新的jxsElement,并删除旧的
    let newReturnStm = t.returnStatement(newJsx);
    path.remove();
    path.parent.body.push(newReturnStm);
  }
};
```
