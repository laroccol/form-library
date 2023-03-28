import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Form from "./components/Form";
import { useFormControl } from "./hooks/useFormControl";
import { FormLayout } from "./types/form";

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
    (data) => console.log(data)
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

const testFormLayout: FormLayout = [
  {
    id: "test",
    inputType: "text",
    length: 10,
    required: true,
  },
  {
    id: "test2",
    inputType: "textarea",
    length: 10,
    displayValue: "Test 2",
  },
  {
    id: "test3",
    inputType: "date",
    length: 10,
  },
  { id: "checkbox", inputType: "boolean", length: 10 },
  {
    id: "select",
    inputType: "dropdown",
    length: 10,
    options: [
      {
        value: "test",
        display: "Test",
      },
      {
        value: "test2",
        display: "Test 2",
      },
      {
        value: "test3",
        display: "Test 3",
      },
    ],
  },
  {
    id: "select2",
    inputType: "radio",
    length: 10,
    options: [
      {
        value: "test",
        display: "Test",
      },
      {
        value: "test2",
        display: "Test 2",
      },
      {
        value: "test3",
        display: "Test 3",
      },
    ],
  },
  {
    id: "select3",
    inputType: "radio",
    length: 10,
    options: [
      {
        value: "test",
        display: "Test",
      },
      {
        value: "test2",
        display: "Test 2",
      },
      {
        value: "test3",
        display: "Test 3",
      },
    ],
  },
  {
    id: "num",
    inputType: "number",
    length: 10,
  },
];

export default App;
