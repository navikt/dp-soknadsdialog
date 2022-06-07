import React, { useState } from "react";
import { DatePicker } from "../input/date-picker";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { formatISO } from "date-fns";
import { QuizDatoFaktum } from "../../types/quiz.types";
import { useFaktumSanityText } from "../../hooks/useFaktumSanityText";
import { useQuiz } from "../../context/quiz-context";

export function FaktumDato(props: FaktumProps<QuizDatoFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const faktumTexts = useFaktumSanityText(props.faktum.beskrivendeId);
  const [currentAnswer, setCurrentAnswer] = useState(props.faktum.svar);

  const onDateSelection = (value: Date) => {
    const date = formatISO(value, { representation: "date" });
    setCurrentAnswer(date);
    onChange ? onChange(faktum, date) : saveFaktum(date);
  };

  function saveFaktum(value: string) {
    saveFaktumToQuiz(faktum, value);
  }

  return (
    <div>
      {faktumTexts?.description && <PortableText value={faktumTexts.description} />}
      {faktumTexts?.helpText && <p>{faktumTexts.helpText.title}</p>}
      <DatePicker
        label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
        onChange={onDateSelection}
        value={currentAnswer}
      />
    </div>
  );
}
