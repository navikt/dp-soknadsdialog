import React from "react";
import { IPrimitivFaktum } from "../../types/faktum.types";
import { DatePicker } from "../input/DatePicker";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";

export function FaktumDato(props: FaktumProps<IPrimitivFaktum>) {
  const { faktum, onChange } = props;
  const onDateSelection = (value: Date) => {
    onChange(faktum.id, value);
  };

  return (
    <div>
      {faktum.description && <PortableText value={faktum.description} />}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}
      <DatePicker label={faktum.title ? faktum.title : faktum.id} onChange={onDateSelection} />
    </div>
  );
}
