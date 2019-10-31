import React from 'react';
import catchreacterror from './dist';

import logo from './logo.svg';
import './App.css';

console.log(catchreacterror);

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
    @catchreacterror()
    render() {
        return <Button text="click me" />;
    }
}

class Button extends React.Component {
    render() {
        return <button>click me</button>;
    }

    componentDidMount() {
        const emptyObj = {};
        //console.log(emptyObj.a.b)
    }
}

export default App;
