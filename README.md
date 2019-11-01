### 简介

使用 ES7 的`Decorator`配合`React ErrorBoundary`捕获 React 生命周期期间发生的错误

### 使用方式

#### 1.安装 catch-react-error

```sh
nenpm install @music/catch-react-error
```

#### 2.安装 ES7 Decorator babel plugin

```sh
yarn add @babel/plugin-proposal-decorators --dev
yarn add @babel/plugin-proposal-class-properties --dev
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
import catchreacterror, {
    CSRErrorBoundary,
    SSRErrorBoundary,
} from '@music/catch-react-error';
```

#### 4.使用@catchreacterror decorator

```jsx
class Test extends React.Component {
    @catchreacterror('client', CSRErrorBoundary)
    render() {
        return <Button text="click me" />;
    }
}
```

`catchreacterror`函数接受两个参数；

第一个为字符串('client or 'server'，可以不传默认为'client'),用来标示是客户端渲染还是服务渲染；

第二个参数为`ErrorBoundary`组件，默认为使用者提供了两个模版分别为客户度渲染`CSRErrorBoundary`,服务端渲染`SSRErrorBoundary`;用户可以完全不使用模版，而自定义`ErrorBounday`组件，传递给`catchreacterror`函数

#### 5.添加自定义错误信息

如果使用`ErrorBounday`模版,并针对不同的组件想要个性化的错误提示：则可以在`React Component`中添加`fallback`函数，该函数返回值为`自定义的展示内容即可`，例如：

```jsx
class Test extends React.Component {
    fallback = err => {
        return <div>自定义错误提示信息</div>;
    };

    @catchreacterror(undefined, CSRErrorBoundary)
    render() {
        return <Button text="click me" />;
    }
}
```

> `fallback`函数的参数,为 Error 对象实例，可以获取具体的错误信息,用来自定义错误提示，或用于上报错误等

如果不提供自定义的`fallback`函数则会使用默认模版中的错误信息展示，即：`<div>Something went Wrong</div>`

> 默认`fallback`函数为：`const FallbackFunc = (): React.ReactNode => <div>Something went Wrong</div>`
