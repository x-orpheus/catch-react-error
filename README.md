# catch-react-error

[![npm](https://img.shields.io/npm/v/catch-react-error?style=flat-square)](https://www.npmjs.com/package/catch-react-error)

# 简介

使用 TS 的`Decorator`配合`React ErrorBoundary`捕获 React 生命周期期间发生的错误

# demo

## client side server

```sh
cd example-client
npm start
```

#### server side server

```sh
cd example-server
npm run dev
```

# How to use

## 1.安装 catch-react-error

```sh
npm  install catch-react-error --save
```

## 2.安装 ES7 Decorator babel plugin

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

## 3.导入 catch-react-error

```jsx
import catchreacterror from "catch-react-error";
```

## 4.使用@catchreacterror decorator

```jsx
@catchreacterror()
class Test extends React.Component {
  render() {
    return <Button text="click me" />;
  }
}
```

`catchreacterror`函数接受一个参数:ErrorBoundary(默认采用`DefaultErrorBoundary`)

其原理为：客户端渲染会用 React 16 的[Error Boundary](https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html)的相关函数来处理错误，服务端用`try catch`来捕获 render 的错误。

## 5.使用@catchreacterror 处理 FunctionComponent

上面是对于`ClassComponent`做的处理，但是有些人喜欢用函数组件，这里也提供使用方法,如下。

```js
const Content = (props, b, c) => {
  return <div>{props.x.length}</div>;
};

const SafeContent = catchreacterror(DefaultErrorBoundary)(Content);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>这是正常展示内容</h1>
      </header>
      <SafeContent/>
  );
}

```

## 6.如何编写 CustomErrorBoundary

拷贝下面代码，修改成自己所需。

```js
class CustomErrorBoundary extends React.Component {
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
  }

    return this.props.children;
  }
}
```
