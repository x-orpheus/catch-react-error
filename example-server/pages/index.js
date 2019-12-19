import React from "react";
// import catchreacterror, { DefaultErrorBoundary } from "./dist";
import catchreacterror, { DefaultErrorBoundary } from "catch-react-error";
import "./index.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>这是正常展示内容</h1>
      </header>
      <Test></Test>
      <SafeContent />
    </div>
  );
}

class Test extends React.Component {
  constructor() {
    super();
    this.state = {
      foo: 1
    };
    this.buttonRef = React.createRef();
  }

  render() {
    const { foo } = this.state;
    console.log(foo);
    return (
      <div>
        <Foo test="foo" />
        <Button text="click me" ref={this.buttonRef} />
        <Label list={["a", "abc", null, "abcd"]} />
      </div>
    );
  }

  componentDidMount() {
    console.log(this.buttonRef.current);
  }
}
@catchreacterror()
class Button extends React.Component {
  click() {
    console.log("button click");
  }
  render() {
    const emptyObj = {};
    console.log(emptyObj.a.b);
    return <button onClick={this.click}>click me</button>;
  }
}

const Label = ({ list }, b, c) => {
  return list.map(x => <SafeContent x={x} kye={x} />);
};

const Content = (props, b, c) => {
  return <div>{props.x.length}</div>;
};

const SafeContent = catchreacterror(DefaultErrorBoundary)(Content);

const Foo = (a, b, c) => {
  return <p>Foo</p>;
};

export default App;
