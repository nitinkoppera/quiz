import React, { useState } from "react";
import DragAndDrop from "./DragAndDrop";

function App(props) {
  const n = 5;
  const [input, setInput] = useState(
    new Array(n).fill({}).map((item, index) => ({
      itemId: index,
      val: Math.ceil(Math.random() * 100),
    }))
  );
  const reset = () => {
    setInput(
      new Array(n).fill({}).map((item, index) => ({
        itemId: index,
        val: Math.ceil(Math.random() * 100),
      }))
    );
  };
  return <DragAndDrop input={input} n={n} reset={reset} />;
}

export default App;
