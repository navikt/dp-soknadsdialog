import React from "react";
import { IPrimitivFaktum } from "../../types/faktum.types";
import { DatePicker } from "../input/DatePicker";

export function FaktumDato(props: IPrimitivFaktum) {
  function onChange(value: Date) {
    // eslint-disable-next-line no-console
    console.log("Ny verdi:", value);
  }

  return (
    <div>
      {props.description && <p>{props.description}</p>}
      {props.helpText && <p>{props.helpText}</p>}
      {props.alertText && <p>{props.alertText}</p>}
      <DatePicker label={props.title ? props.title : props.id} onChange={onChange} />
    </div>
  );
}
