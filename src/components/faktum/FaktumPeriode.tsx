import React, { useEffect, useState } from "react";
import { IPrimitivFaktum } from "../../types/faktum.types";
import { DatePicker } from "../input/date-picker";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { AnswerPeriod, saveAnswerToQuiz } from "../../store/answers.slice";
import { formatISO } from "date-fns";
import { setSectionFaktumIndex } from "../../store/navigation.slice";

export function FaktumPeriode(props: FaktumProps<IPrimitivFaktum>) {
  const dispatch = useDispatch();
  const { faktum, onChange } = props;
  const answers = useSelector((state: RootState) => props.answers || state.answers);
  const currentSectionFaktumIndex = useSelector(
    (state: RootState) => state.navigation.sectionFaktumIndex
  );
  const currentAnswer = (answers.find((answer) => answer.textId === faktum.textId)
    ?.value as AnswerPeriod) ?? { fromDate: "" };

  const [fromDate, setFromDate] = useState<Date | undefined>(
    currentAnswer.fromDate ? new Date(currentAnswer.fromDate) : undefined
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    currentAnswer.toDate ? new Date(currentAnswer.toDate) : undefined
  );

  useEffect(() => {
    if (fromDate) {
      const parsedFromDate = formatISO(fromDate, { representation: "date" });
      const period = { ...currentAnswer, fromDate: parsedFromDate };
      onChange ? onChange(faktum, period) : saveFaktum(period);
    }
  }, [fromDate]);

  useEffect(() => {
    if (toDate) {
      const parsedToDate = formatISO(toDate, { representation: "date" });
      const period = { ...currentAnswer, toDate: parsedToDate };
      onChange ? onChange(faktum, period) : saveFaktum(period);
    }
  }, [toDate]);

  function saveFaktum(value: AnswerPeriod) {
    dispatch(
      saveAnswerToQuiz({
        textId: faktum.textId,
        value: value,
        type: faktum.type,
        id: faktum.id,
      })
    );

    dispatch(setSectionFaktumIndex(currentSectionFaktumIndex + 1));
  }

  return (
    <div>
      {faktum.description && <PortableText value={faktum.description} />}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}
      <DatePicker
        label={"Fra dato"}
        onChange={setFromDate}
        value={fromDate ? fromDate.toISOString() : ""}
      />
      <DatePicker
        label={"Til dato"}
        disabled={!fromDate}
        onChange={setToDate}
        value={toDate ? toDate.toISOString() : ""}
      />
    </div>
  );
}
