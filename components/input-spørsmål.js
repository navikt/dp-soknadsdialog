import { Input } from "nav-frontend-skjema";
import { useState } from "react";

export default function InputSpørsmål({ id, navn, handleChange, type, svar }) {
  const [value, setValue] = useState(svar);

  const onChange = (event) => {
    handleChange(event.target.value);
    setValue(event.target.value);
    event.preventDefault();
  };

  return (
    <Input
      label={navn}
      inputMode={getInputMode(type)}
      onChange={onChange}
      data-testid={`input-${id}`}
      value={value}
    />
  );
}

function getInputMode(type) {
  switch (type) {
    case "int":
      return "numeric";
    default:
      return "";
  }
}
