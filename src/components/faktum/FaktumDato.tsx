import React, { useEffect, useState } from "react";
import { BodyShort, Label } from "@navikt/ds-react";
import { formatISO, isFuture } from "date-fns";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { IQuizDatoFaktum } from "../../types/quiz.types";
import { DatePicker } from "../date-picker/DatePicker";
import { isOverTwoWeeks, isValidDateYear, isValidYearRange } from "./validation/validations.utils";
import { FormattedDate } from "../FormattedDate";
import { HelpText } from "../HelpText";
import { IFaktum } from "./Faktum";
import styles from "./Faktum.module.css";
import { useValidation } from "../../context/validation-context";

export function FaktumDato(props: IFaktum<IQuizDatoFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { unansweredFaktumId } = useValidation();
  const { getAppText, getFaktumTextById } = useSanity();
  const [isValid, setIsValid] = useState(true);
  const [hasWarning, setHasWarnining] = useState(false);
  const faktumTexts = getFaktumTextById(props.faktum.beskrivendeId);
  const [currentAnswer, setCurrentAnswer] = useState(props.faktum.svar);

  useEffect(() => {
    if (props.faktum.svar) {
      const hasWarning = !validateInput(new Date(props.faktum.svar));
      setHasWarnining(hasWarning);
    }
  }, []);

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

  function getValidationMessage() {
    if (unansweredFaktumId === faktum.id) {
      return getAppText("validering.faktum.ubesvart");
    } else if (!isValid) {
      return faktumTexts?.errorMessage ? faktumTexts.errorMessage : faktum.beskrivendeId;
    } else {
      return undefined;
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
        hasError={!isValid || unansweredFaktumId === faktum.id}
        errorMessage={getValidationMessage()}
        hasWarning={hasWarning}
        warningMessage={getAppText("validering.dato-faktum.soknadsdato-varsel")}
      />
      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
    </>
  );
}
