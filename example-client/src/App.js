import React from 'react';
import catchreacterror, { IsomorphicErrorBoundary } from './dist';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>这是正常展示内容</h1>
            </header>
            <Test></Test>
        </div>
    );
}

class Test extends React.Component {
    // fallback() {
    //     return <div>自定义错误提示信息</div>;
    // };

    @catchreacterror(IsomorphicErrorBoundary)
    render() {
        return <Button text="click me" />;
    }
}

class Button extends React.Component {
    render() {
        const emptyObj = {};
        console.log(emptyObj.a.b);
        return <button>click me</button>;
    }

    componentDidMount() {
        const emptyObj = {};
        console.log(emptyObj.a.b);
    }
}

export default App;
