import React from 'react';
import catchreacterror, { CSRErrorBoundary, SSRErrorBoundary } from './dist';
import ErrorBoundary from './components/ErrorBoundary';

import logo from './logo.svg';
import './App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <Test></Test>
            </header>
        </div>
    );
}

class Test extends React.Component {
    fallback = err => {
        return <div>自定义错误提示信息</div>;
    };

    @catchreacterror('client', CSRErrorBoundary)
    render() {
        return <Button text="click me" />;
    }
}

console.log(React.Component.prototype.isPrototypeOf(Test.prototype));

class Button extends React.Component {
    render() {
        return <button>click me</button>;
    }

    componentDidMount() {
        const emptyObj = {};
        console.log(emptyObj.a.b);
    }
}

export default App;
