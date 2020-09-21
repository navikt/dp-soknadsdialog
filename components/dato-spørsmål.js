import { Datovelger } from "nav-datovelger";
import { Label } from "nav-frontend-skjema";
import { useState } from "react";

export default function DatoSpørsmål({ navn, handleChange, className }) {
  const [dato, setDato] = useState("");

  function onChange(value) {
    setDato(value);
    handleChange(value);
  }

  return (
    <>
      <Label htmlFor={navn}>{navn}</Label>
      <Datovelger
        id={navn}
        onChange={onChange}
        className={className}
        valgtDato={dato}
      />
    </>
  );
}
