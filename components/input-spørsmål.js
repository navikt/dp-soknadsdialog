import { Input } from "nav-frontend-skjema";

export default function InputSpørsmål({ id, navn, handleChange, type }) {
  function onChange(event) {
    handleChange(event.target.value);
  }
  return (
    <Input
      label={navn}
      inputMode={getInputMode(type)}
      onChange={onChange}
      data-testid={`input-${id}`}
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
