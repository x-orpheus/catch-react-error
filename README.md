# catch-react-error

[![npm](https://img.shields.io/npm/v/catch-react-error?style=flat-square)](https://www.npmjs.com/package/catch-react-error)
[![Build Status](https://travis-ci.org/x-orpheus/catch-react-error.svg?branch=master)](https://travis-ci.org/x-orpheus/catch-react-error)
[![codecov](https://img.shields.io/codecov/c/gh/x-orpheus/catch-react-error?style=flat-square&logo=codecov)](https://codecov.io/gh/x-orpheus/catch-react-error)

English | [简体中文](./README-zh_CN.md)

[DOC V3](./README-V3.md)

[Why we create catch-react-error](./doc/catch-react-error_EN.md)

## Introduction

This package supports both `React` And `React Native`.

This project make it easy to protect your react source code。

We combine decorators and React Error Boundaries together.

The React Error Boundaries don't support the Server Side Rendering，so we use `try/catch` to deal such condition.

The catch-react-error takes only one argument,[React Error Boundary Component](https://reactjs.org/docs/error-boundaries.html) which
we provide DefaultErrorBoundary as the default one.

```js
const catchreacterror = (
  Boundary: ErrorBoundary,
  SomeComponent: ComponentClass | FunctionComponent
) => {};
```

<div style="text-align:center" align="center">
  <img src="https://p1.music.126.net/6tHW45dHH_qKtCw0rrkJOg==/109951164571395030.gif" />
</div>

## Demo

we provide some demo, so you can understand the library more clearly

### client side render

```sh
cd example-client
npm install
npm run dev
```

### server side render

```sh
cd example-server
npm install
npm run dev
```

## How to use

### 1.install catch-react-error

```sh
npm install catch-react-error --save
```

### 2. Install ES7 Decorator babel plugin

```sh
npm install --save-dev @babel/plugin-proposal-decorators
npm install --save-dev @babel/plugin-proposal-class-properties
```

babel plugin configuration

```json
{
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }]
  ]
}
```

### 3. import catch-react-error

```jsx
import catchreacterror from "catch-react-error";
```

### 4. Use @catchreacterror on class component

```jsx
@catchreacterror
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

### 5. Use @catchreacterror on functionc component

```js
function Count({ count }) {
  if (count === 3) {
    throw new Error("count is three");
  }
  return <h1>{count}</h1>;
}

const SaleCount = catchreacterror(Count);
```

### 6. Add a CustomErrorBoundary component

- First, create an normal Error Boundary Component and change it.

  **custom Errorboundary must has a static property: `catchreacterror:true`**

```jsx
class CustomErrorBoundary extends React.Component {
  constructor (props) {
    super (props);
    this.state = {hasError: false};
  }

  // This is the mark point that distinguishes ErrorBoundary Component and custom Component
  static catchreacterror = true

  static getDerivedStateFromError (error) {
    return {hasError: true};
  }

  componentDidCatch (error, errorInfo) {
      //do something as needed
    reportToMyLogService (error, errorInfo);
  }

  render () {
    if (this.state.hasError) {
      return <h1> Something with my app,fallback ui. </ h1>;
    }
  }

    return this.props.children;
  }
}

```

- Second, pass it as the argument

```jsx
@catchreacterror(CustomErrorBoundary)
class Count extends React.Component {}
```

or

```jsx
const SaleCount = catchreacterror(CustomErrorBoundary, Count);
```

## TODO

- curried function
- log to sentry

## License

MIT.
