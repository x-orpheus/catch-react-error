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
    constructor() {
        super();
        this.state = {
            foo: 1,
        };
        this.buttonRef = React.createRef();
    }

    render() {
        const { foo } = this.state;
        console.log(foo);
        return (
            <div>
                <Button text="click me" ref={this.buttonRef} />
                <Label list={['a', 'abc', null, 'abcd']} />
            </div>
        );
    }

    componentDidMount() {
        console.log(this.buttonRef);
    }
}
@catchreacterror()
class Button extends React.Component {
    render() {
        const emptyObj = {};
        console.log(emptyObj.a.b);
        return <button>click me</button>;
    }
}

const Label = ({ list }) => {
    return list.map(x => <SafeContent x={x} kye={x} />);
};

const Content = ({ x }) => <div>{x.length}</div>;

const SafeContent = catchreacterror(IsomorphicErrorBoundary)(Content);

export default App;
