import { useState } from "react";

export default function DatoSpørsmål({
  id,
  navn,
  handleChange,
  className,
  svar,
}) {
  const [dato, setDato] = useState(svar);

  function onChange(value) {
    setDato(value);
    handleChange(value);
  }

  return (
    <>
    <label data-testid={`input-${id}`} htmlFor={navn}>{navn}</label>
    <input id={navn} className={className} placeholder="DATOVELGER" />
    </>
  );
}
