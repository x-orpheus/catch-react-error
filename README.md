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
import catchreacterror from '@music/catch-react-error';
```

#### 4.使用@catchreacterror decorator

```jsx
class Test extends React.Component {
    @catchreacterror('i')
    render() {
        return <Button text="click me" />;
    }
}
```

`catchreacterror`函数接受两个参数；

1. 第一个为字符串('c or 'i'，c 代表 client,i 代表 isomporphic),用来标示是客户端渲染还是同构直出渲染；客户端渲染会用 React 16 的[Error Boundary](https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html)的相关函数来处理来处理，主要是 componentDidCatch。而同构直出则会用`try catch`来处理服务端，Eorror Boundary 函数处理客户端。

2. 第二个参数为`customErrorBoundary`组件。可以添加自己定义 error boundary 组件，具体用法看下面。

#### 5.添加自定义错误处理组件

如果使用`ErrorBounday`模版,并针对不同的组件想要个性化的错误提示：则可以在`React Component`中添加`fallback`函数，该函数返回值为`自定义的展示内容即可`，例如：

```jsx
class Test extends React.Component {
    fallback = err => {
        return <div>自定义错误提示信息</div>;
    };

    @catchreacterror('c')
    render() {
        return <Button text="click me" />;
    }
}
```

`fallback`函数的参数,为 Error 对象实例，可以获取具体的错误信息,用来自定义错误提示，或用于上报错误等

如果不提供自定义的`fallback`函数则会使用默认模版中的错误信息展示，即：`<div>Something went Wrong</div>`

> 默认`fallback`函数为：`const FallbackFunc = (): React.ReactNode => <div>Something went Wrong</div>`
