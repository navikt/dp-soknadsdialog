import React, { useState } from "react";
import { IFaktum } from "./Faktum";
import { formatISO } from "date-fns";
import { IQuizDatoFaktum } from "../../types/quiz.types";
import { useQuiz } from "../../context/quiz-context";
import { DatePicker } from "../date-picker/DatePicker";
import { useSanity } from "../../context/sanity-context";
import { BodyShort, Label } from "@navikt/ds-react";
import { HelpText } from "../HelpText";
import { FormattedDate } from "../FormattedDate";
import { isFuture } from "date-fns";
import { isValidSoknadDate, isValidYearRange } from "../faktum/validations";
import styles from "./Faktum.module.css";

export function FaktumDato(props: IFaktum<IQuizDatoFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const [isValid, setIsValid] = useState(true);
  const faktumTexts = useSanity().getFaktumTextById(props.faktum.beskrivendeId);
  const [currentAnswer, setCurrentAnswer] = useState(props.faktum.svar);

  const onDateSelection = (value: Date) => {
    const date = formatISO(value, { representation: "date" });
    setCurrentAnswer(date);
    onChange ? onChange(faktum, date) : saveFaktum(date);
  };

  function saveFaktum(value: string) {
    validateInput(new Date(value));

    if (isValid) {
      saveFaktumToQuiz(faktum, value);
    }
  }

  if (props.faktum.readOnly || props.readonly) {
    return (
      <>
        <Label>{faktumTexts ? faktumTexts.text : faktum.beskrivendeId}</Label>
        <BodyShort>{currentAnswer ? <FormattedDate date={currentAnswer} /> : ""}</BodyShort>
      </>
    );
  }

  function validateInput(date: Date) {
    switch (props.faktum.beskrivendeId) {
      case "faktum.dagpenger-soknadsdato": {
        const isValid = isValidSoknadDate(date);
        setIsValid(isValid);
        break;
      }
      case "faktum.barn-foedselsdato": {
        const isValid = isValidYearRange(date) && !isFuture(date);
        setIsValid(isValid);
        break;
      }
      default: {
        const isValid = isValidYearRange(date);
        setIsValid(isValid);
        break;
      }
    }
  }

  return (
    <>
      <DatePicker
        id={props.faktum.beskrivendeId}
        value={currentAnswer}
        onChange={onDateSelection}
        label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
        description={faktumTexts?.description}
        hasError={!isValid}
        errorMessage={faktumTexts?.errorMessage ? faktumTexts.errorMessage : faktum.beskrivendeId}
      />
      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
    </>
  );
}
