import { Input } from "nav-frontend-skjema";

export default function InputSpørsmål({ navn, handleChange, type }) {
  function onChange(event) {
    handleChange(event.target.value);
  }
  return (
    <Input label={navn} inputMode={getInputMode(type)} onChange={onChange} />
  );
}

function getInputMode(type) {
  switch (type) {
    case "Int":
      return "numeric";
    default:
      return "";
  }
}
