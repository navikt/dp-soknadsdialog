import React from "react";
import { IPrimitivFaktum } from "../../types/faktum.types";
import { DatePicker } from "../input/DatePicker";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";

export function FaktumPeriode(props: FaktumProps<IPrimitivFaktum>) {
  const { faktum } = props;
  function onChange(value: Date) {
    // eslint-disable-next-line no-console
    console.log("Ny verdi:", value);
  }

  return (
    <div>
      {faktum.description && <PortableText value={faktum.description} />}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}
      <DatePicker label={"Fra dato"} onChange={onChange} />
      <DatePicker label={"Til dato"} onChange={onChange} />
    </div>
  );
}
