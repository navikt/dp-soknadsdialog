import React from "react";
import { IPrimitivFaktum } from "../../types/faktum.types";
import { DatePicker } from "../input/DatePicker";
import { FaktumProps } from "./Faktum";

export function FaktumDato(props: FaktumProps<IPrimitivFaktum>) {
  const { faktum, onChange } = props;
  const onDateSelection = (value: Date) => {
    onChange(faktum.id, value);
  };

  return (
    <div>
      {faktum.description && <p>{faktum.description}</p>}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}
      <DatePicker label={faktum.title ? faktum.title : faktum.id} onChange={onDateSelection} />
    </div>
  );
}
