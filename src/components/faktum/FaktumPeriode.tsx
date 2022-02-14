import React, { useEffect, useState } from "react";
import { IPrimitivFaktum } from "../../types/faktum.types";
import { DatePicker } from "../input/DatePicker";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";

export function FaktumPeriode(props: FaktumProps<IPrimitivFaktum>) {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const { faktum, onChange } = props;

  useEffect(() => {
    if (fromDate !== null && toDate !== null) {
      onChange && onChange(faktum.beskrivendeId, { fromDate, toDate });
    }
  }, [fromDate, toDate]);

  return (
    <div>
      {faktum.description && <PortableText value={faktum.description} />}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}
      <DatePicker label={"Fra dato"} onChange={setFromDate} />
      <DatePicker label={"Til dato"} onChange={setToDate} />
    </div>
  );
}
