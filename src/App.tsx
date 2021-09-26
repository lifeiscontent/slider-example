import React from "react";
import "./App.css";
import { UntrustedSlider } from "./components/UntrustedSlider";
import { ValueChangeSlider } from "./components/ValueChangeSlider";

function App() {
  const [value, setValue] = React.useState("500000");

  const handleUntrustedChange: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback((event) => {
      setValue(event.currentTarget.value);
    }, []);

  const formatValueText = React.useCallback(
    (value: number) =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value),
    []
  );

  return (
    <React.Fragment>
      <div>
        <UntrustedSlider
          formatValueText={formatValueText}
          min="0"
          max="1000000"
          step="100000"
          value={value}
          onChange={handleUntrustedChange}
        />
      </div>
      <div>
        <ValueChangeSlider
          formatValueText={formatValueText}
          max="1000000"
          min="0"
          onChange={setValue}
          step="100000"
          value={value}
        />
      </div>
    </React.Fragment>
  );
}

export default App;
