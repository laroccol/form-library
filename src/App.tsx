import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Form from "./components/Form";
import { useFormControl } from "./hooks/useFormControl";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <TestComponent />
    </div>
  );
}

const TestComponent = () => {
  const [count, setCount] = useState(0);
  const { formState, submit, changeField } = useFormControl(
    testFormLayout,
    () => null
  );

  return (
    <Form
      formLayout={testFormLayout}
      formState={formState}
      onSubmit={submit}
      onChangeField={changeField}
    />
  );
};

const testFormLayout = [
  {
    id: "test",
    inputType: "text",
    length: 10,
    required: true,
  },
  {
    id: "test2",
    inputType: "text",
    length: 5,
    displayValue: "Test 2",
  },
  {
    id: "test3",
    inputType: "text",
    length: 10,
  },
];

export default App;
