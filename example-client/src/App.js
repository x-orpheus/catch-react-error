import React, { useState } from "react";
import catchreacterror, { DefaultErrorBoundary } from "./dist/index";
import CustomErrorBoundary from "./custom";

import "./App.css";

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

const SafeCount = catchreacterror(CustomErrorBoundary, fnCount);
const SafeCount2 = catchreacterror(fnCount);

function App() {
  const [count, setCount] = useState(0);
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
      <section>
        <Count count={count} />
      </section>
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

export default App;
