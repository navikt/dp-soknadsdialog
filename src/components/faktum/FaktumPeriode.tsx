import React, { useEffect, useState } from "react";
import { DatePicker } from "../input/date-picker";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { formatISO } from "date-fns";
import { QuizPeriodeFaktum } from "../../types/quiz.types";
import { getFaktumSanityText } from "../../hooks/getFaktumSanityText";

export function FaktumPeriode(props: FaktumProps<QuizPeriodeFaktum>) {
  const { faktum, onChange } = props;
  const faktumTexts = getFaktumSanityText(props.faktum.beskrivendeId);

  const [fromDate, setFromDate] = useState<Date | undefined>(
    faktum.svar?.fom ? new Date(faktum.svar?.fom) : undefined
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    faktum.svar?.tom ? new Date(faktum.svar?.tom) : undefined
  );

  useEffect(() => {
    if (fromDate) {
      const parsedFromDate = formatISO(fromDate, { representation: "date" });
      const period = { ...faktum.svar, fom: parsedFromDate };
      onChange ? onChange(faktum, period) : saveFaktum(period);
    }
  }, [fromDate]);

  useEffect(() => {
    if (toDate) {
      const parsedToDate = formatISO(toDate, { representation: "date" });
      // toDate is disabled until fromDate is answered. CurrentAnswer will always contain fromDate so it's safe to cast as AnswerPeriod
      const period = { ...faktum.svar, tom: parsedToDate };
      onChange ? onChange(faktum, period) : saveFaktum(period);
    }
  }, [toDate]);

  function saveFaktum(value: any) {
    console.log("Todo: Save period");
  }

  return (
    <div>
      {faktumTexts?.description && <PortableText value={faktumTexts.description} />}
      {faktumTexts?.helpText && <p>{faktumTexts.helpText.title}</p>}
      <DatePicker
        label={"Fra dato"}
        onChange={setFromDate}
        value={fromDate ? fromDate.toISOString() : undefined}
      />
      <DatePicker
        label={"Til dato"}
        disabled={!fromDate}
        onChange={setToDate}
        value={toDate ? toDate.toISOString() : undefined}
      />
    </div>
  );
}
