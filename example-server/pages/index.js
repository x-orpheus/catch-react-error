import React, { useState } from "react";
import catchreacterror, { DefaultErrorBoundary } from "../../dist";
import CustomErrorBoundary from "./custom";

import "./index.css";

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

@catchreacterror(CustomErrorBoundary)
class CustomCount extends React.Component {
  render() {
    const { count } = this.props;
    if (count === 3) {
      throw new Error("count is three");
    }
    return <h1>{count}</h1>;
  }
}

function fnCount({ count }) {
  if (count === 3) {
    throw new Error("count is three");
  }
  return <h1>{count}</h1>;
}

function App() {
  const [count, setCount] = useState(0);
  const [content, setContent] = useState([]);
  return (
    <div className="App">
      <section className="btns">
        <button className="btn" onClick={() => setCount(count => count + 1)}>
          +
        </button>
        <button className="btn" onClick={() => setCount(count => count - 1)}>
          -
        </button>
      </section>
      <hr />
      <div>
        <Count count={count} />
      </div>
      <div>
        <CustomCount count={count} />
      </div>
      <div>
        Function componnet: <SafeCount count={count} />
      </div>
      <div>
        Function componnet2: <SafeCount2 count={count} />
      </div>
    </div>
  );
}

const SafeCount = catchreacterror(fnCount);
const SafeCount2 = catchreacterror(CustomErrorBoundary, fnCount);

export default App;
