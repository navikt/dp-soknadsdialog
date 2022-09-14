import React, { useState } from "react";
import { IFaktum } from "./Faktum";
import { formatISO } from "date-fns";
import { IQuizDatoFaktum } from "../../types/quiz.types";
import { useQuiz } from "../../context/quiz-context";
import { DatePicker } from "../date-picker/DatePicker";
import { useSanity } from "../../context/sanity-context";
import { BodyShort, Label } from "@navikt/ds-react";
import { HelpText } from "../HelpText";
import styles from "./Faktum.module.css";
import { FormattedDate } from "../FormattedDate";

export function FaktumDato(props: IFaktum<IQuizDatoFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const faktumTexts = useSanity().getFaktumTextById(props.faktum.beskrivendeId);
  const [currentAnswer, setCurrentAnswer] = useState(props.faktum.svar);

  const onDateSelection = (value: Date) => {
    const date = formatISO(value, { representation: "date" });
    setCurrentAnswer(date);
    onChange ? onChange(faktum, date) : saveFaktum(date);
  };

  function saveFaktum(value: string) {
    saveFaktumToQuiz(faktum, value);
  }

  if (props.faktum.readOnly || props.readonly) {
    return (
      <>
        <Label>{faktumTexts ? faktumTexts.text : faktum.beskrivendeId}</Label>
        <BodyShort>{currentAnswer ? <FormattedDate date={currentAnswer} /> : ""}</BodyShort>
      </>
    );
  }

  return (
    <>
      <DatePicker
        id={props.faktum.beskrivendeId}
        value={currentAnswer}
        onChange={onDateSelection}
        label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
        description={faktumTexts?.description}
      />
      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
    </>
  );
}
