import React from "react";
import { IPrimitivFaktum } from "../../types/faktum.types";
import { DatePicker } from "../input/DatePicker";

export function FaktumPeriode(props: IPrimitivFaktum) {
  function onChange(value: Date) {
    console.log("Ny verdi:", value);
  }

  return (
    <div>
      <DatePicker label={"Fra dato"} onChange={onChange} />
      <DatePicker label={"Til dato"} onChange={onChange} />
    </div>
  );
}
