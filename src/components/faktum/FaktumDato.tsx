import React, { useState } from "react";
import { BodyShort, Label } from "@navikt/ds-react";
import { formatISO, isFuture } from "date-fns";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { IQuizDatoFaktum } from "../../types/quiz.types";
import { DatePicker } from "../date-picker/DatePicker";
import { isOverTwoWeeks, isValidDateYear, isValidYearRange } from "../faktum/validations";
import { FormattedDate } from "../FormattedDate";
import { HelpText } from "../HelpText";
import { IFaktum } from "./Faktum";
import styles from "./Faktum.module.css";

export function FaktumDato(props: IFaktum<IQuizDatoFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { getAppTekst, getFaktumTextById } = useSanity();
  const [isValid, setIsValid] = useState(true);
  const [hasWarning, setHasWarnining] = useState(false);
  const faktumTexts = getFaktumTextById(props.faktum.beskrivendeId);
  const [currentAnswer, setCurrentAnswer] = useState(props.faktum.svar);

  const onDateSelection = (value: Date) => {
    const date = formatISO(value, { representation: "date" });
    setCurrentAnswer(date);
    onChange ? onChange(faktum, date) : saveFaktum(date);
  };

  function saveFaktum(value: string) {
    const inputValid = validateInput(new Date(value));

    if (inputValid) {
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
        const isValid = isValidDateYear(date);
        const hasWarning = isOverTwoWeeks(date);
        setIsValid(isValid);
        setHasWarnining(hasWarning);
        return isValid;
      }
      case "faktum.barn-foedselsdato": {
        const isValid = isValidDateYear(date) && !isFuture(date);
        setIsValid(isValid);
        return isValid;
      }
      default: {
        const isValid = isValidYearRange(date);
        setIsValid(isValid);
        return isValid;
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
        hasWarning={hasWarning}
        warningMessage={getAppTekst("validering.varsel-tekst.dagpenger-soknadsdato")}
      />
      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
    </>
  );
}
