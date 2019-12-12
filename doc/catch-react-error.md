# catch-react-error

> 此方案为云音乐营收稳定性项目的产出，参与者[章伟东](https://github.com/xff1874)和[赵祥涛]()

## 一个 bug 引发的血案

韩国某著名男子天团之前在我们平台上架了一张重磅的数字专辑，本来是一件喜大普奔的好事，结果上架后投诉蜂拥而至。部分用户反馈页面打开就奔溃，紧急排查了之后发现就是一行代码导致，下面就是这段 jsx 代码。

```js
  render() {
     const { data, isCreator, canSignOut, canSignIn } = this.props;
     const {  supportCard, creator, fansList, visitorId, memberCount } = data;
     let getUserIcon = (obj) => {
         if (obj.userType == 4) {
             return (<i className="icn u-svg u-svg-yyr_sml" />);
         } else if (obj.authStatus == 1) {
             return (<i className="icn u-svg u-svg-vip_sml" />);
         } else if (obj.expertTags && creator.expertTags.length > 0) {
             return (<i className="icn u-svg u-svg-daren_sml" />);
         }
         return null;
     };
     ...
  }

```

这行`if (obj.expertTags && creator.expertTags.length )` 里面的 creator 应该是 obj，由于手滑，不小心写错了。

对于上面这种情况，lint 工具无法检测出来，因为 creator 恰好同时也是一个变量，这是一个纯粹的逻辑错误。

事情的结果就是我们紧急修复了 bug，官方道歉，相关开发人员得到了队友的处罚，至此告一段落。但是有个声音一直在我心中回响 **如何避免这种事故再次发生** 。 对于这种错误，堵是堵不住的，那么我们就应该思考设计一种兜底机制，能够隔离这种错误，使页面部分报错，而不是整个网页挂掉。

## ErrorBoundary

从 React 16 开始,引入了 ErrorBoundary 组件，它可以捕获它的**子组件**中产生的错误，记录错误日志，并展示降级内容。

> Error boundaries are React components that **catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI** instead of the component tree that crashed

这个特性让我们眼前一亮，精神为之振奋，仿佛在黑暗中看到了一丝亮光。但是经过研究发现，Error Boundary 只能捕获子组件的 render 错误，有一定的局限性，以下的错误是无法处理的:

- [事件处理函数](https://github.com/facebook/react/issues/11409)(比如 onClick,onMouseEnter)
- [异步代码](https://github.com/facebook/react/issues/11334)(如 requestAnimationFrame，setTimeout,promise)
- 服务端渲染
- ErrorBoundary 组件本身的错误。

### 如何创建一个 ErrorBoundary Component

这个非常简单，就是在 React.Component 组件里面添加`static getDerivedStateFromError()`或者`componentDidCatch()`。前者在错误发生时进行降级处理，后面一个函数主要是做日志记录，官方代码如下

```js
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
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

可以看到`getDerivedStateFromError`捕获了错误，然后设置了`hasError`变量，`render`函数里面根据变量的值返回降级的处理`<h1>Something went wrong.</h1>`。
至此一个 ErrorBoundary 组件已经定义好了，使用时只要包裹一个子组件即可。

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

### ErrorBoundary 的普遍用法。

看到 ErrorBoundary 的使用方法之后，大部分团队的用法是写一个 HOC，然后包装一下,比如下面 scratch 的用法

```js
export default errorBoundaryHOC("Blocks")(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Blocks)
);
```

export 的格式有[多种](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export)

```js
export class ClassName {...}
export { name1, name2, …, nameN };
export { variable1 as name1, variable2 as name2, …, nameN };
export * as name1 from …

```

这样带来 2 个问题

1. 对于存量代码修改起来不方便,有时需要修改组件结构
2. 添加删除 HOC 工作量大，非常容易出错

因此，我们在考虑是否有一种方法可以比较方便的处理上面的问题。

## 青铜时代-BabelPlugin

在碰到上面 HOC 的问题之后，我们把目光锁定在能否直接在子组件包裹一个 ErrorBoundary 组件。

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

## 黄金时代-TS Decorator

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
