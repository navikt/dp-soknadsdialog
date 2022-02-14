import React, { useEffect, useState } from "react";
import { IPrimitivFaktum } from "../../types/faktum.types";
import { DatePicker } from "../input/DatePicker";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { AnswerPeriode } from "../../store/answers.slice";

export function FaktumPeriode(props: FaktumProps<IPrimitivFaktum>) {
  const { faktum, onChange } = props;
  const answers = useSelector((state: RootState) => props.answers || state.answers);
  const currentAnswer = (answers.find((answer) => answer.faktumId === faktum.beskrivendeId)
    ?.answer as AnswerPeriode) ?? { fromDate: "" };

  const [fromDate, setFromDate] = useState<string>(currentAnswer.fromDate);
  const [toDate, setToDate] = useState<string>(currentAnswer.toDate);

  useEffect(() => {
    if (fromDate) {
      onChange && onChange(faktum.beskrivendeId, { fromDate, toDate });
    }
  }, [fromDate, toDate]);

  return (
    <div>
      {faktum.description && <PortableText value={faktum.description} />}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}
      <DatePicker label={"Fra dato"} onChange={setFromDate} value={fromDate} />
      <DatePicker label={"Til dato"} onChange={setToDate} value={toDate} />
    </div>
  );
}
