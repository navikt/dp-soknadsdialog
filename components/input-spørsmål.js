import { TextField } from "@navikt/ds-react";
import { useState } from "react";

export default function InputSpørsmål({ id, navn, handleChange, type, svar }) {
  const [value, setValue] = useState(svar);

  const onChange = (event) => {
    handleChange(event.target.value);
    setValue(event.target.value);
    event.preventDefault();
  };

  return (
    <TextField
      label={navn}
      type={getInputMode(type)}
      onChange={onChange}
      data-testid={`input-${id}`}
    ></TextField>
  );
}

function getInputMode(type) {
  switch (type) {
    case "int":
      return "number";
    default:
      return "text";
  }
}
