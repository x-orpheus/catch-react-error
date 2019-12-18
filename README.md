### 简介

[English](xxx.README-en.md)

使用 ES7 的`Decorator`配合`React ErrorBoundary`捕获 React 生命周期期间发生的错误

### 使用方式

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

`catchreacterror`函数接受一个参数:ErrorBoundary(不提供则默认采用`DefaultErrorBoundary`)

自定义的`CustomErrorBoundary`组件。默认会用框架提供的`DefaultErrorBoundary`组件。其原理为：客户端渲染会用 React 16 的[Error Boundary](https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html)的相关函数来处理错误，服务端用`try catch`来捕获 render 的错误。

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
