### 简介

使用 ES7 的`Decorator`配合`React ErrorBoundary`捕获 React 生命周期期间发生的错误

### 使用方式

#### 安装 catch-react-error

```sh
nenpm install @music/catch-react-error
```

#### 安装 ES7 Decorator babel plugin

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

#### 导入 catch-react-error
