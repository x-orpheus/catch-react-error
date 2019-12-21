import React, { useState } from "react";
import catchreacterror, { DefaultErrorBoundary } from "./dist";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [content, setContent] = useState([]);
  return (
    <div className="App">
      <SaleCount count={count} />
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
        <p className="ok-desc">
          Although the Count Component was crashed, but this part was not
          affected
        </p>
        <button
          className="btn ok-btn"
          onClick={() => {
            setContent(content => ["clicked!", ...content]);
          }}
        >
          I'm OK, click me !
        </button>
        {content.map(x => (
          <p className="ok-content">{x}</p>
        ))}
      </section>
    </div>
  );
}

function Count({ count }) {
  if (count === 3) {
    throw new Error("count is three");
  }
  return <h1>{count}</h1>;
}

const SaleCount = catchreacterror()(Count);

export default App;
