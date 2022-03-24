import React from "react";
import { IPrimitivFaktum } from "../../types/faktum.types";
import { DatePicker } from "../input/date-picker";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { formatISO } from "date-fns";
import { saveAnswerToQuiz } from "../../store/answers.slice";

export function FaktumDato(props: FaktumProps<IPrimitivFaktum>) {
  const dispatch = useDispatch();
  const { faktum, onChange } = props;
  const answers = useSelector((state: RootState) => props.answers || state.answers);
  const currentAnswer = answers.find((answer) => answer.textId === faktum.textId)?.value as
    | string
    | undefined;

  const onDateSelection = (value: Date) => {
    const date = formatISO(value, { representation: "date" });
    onChange ? onChange(faktum, date) : saveFaktum(date);
  };

  function saveFaktum(value: string) {
    dispatch(
      saveAnswerToQuiz({
        textId: faktum.textId,
        value: value,
        type: faktum.type,
        id: faktum.id,
      })
    );
  }

  return (
    <div>
      {faktum.description && <PortableText value={faktum.description} />}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}
      <DatePicker
        label={faktum.title ? faktum.title : faktum.textId}
        onChange={onDateSelection}
        value={currentAnswer}
      />
    </div>
  );
}
