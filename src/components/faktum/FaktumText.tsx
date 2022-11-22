import React, { ChangeEvent, useEffect, useState } from "react";
import { Textarea, BodyShort, Label, TextField } from "@navikt/ds-react";
import { IFaktum } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";
import { IQuizTekstFaktum } from "../../types/quiz.types";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { HelpText } from "../HelpText";
import { isValidTextLength } from "./validation/validations.utils";
import { useValidation } from "../../context/validation-context";
import { TEXTAREA_FAKTUM_IDS } from "../../constants";
import { useFirstRender } from "../../hooks/useFirstRender";
import styles from "./Faktum.module.css";

export function FaktumText(props: IFaktum<IQuizTekstFaktum>) {
  const { faktum, onChange } = props;
  const isFirstRender = useFirstRender();
  const { saveFaktumToQuiz } = useQuiz();
  const { unansweredFaktumId } = useValidation();
  const { getAppText, getFaktumTextById } = useSanity();
  const [isValid, setIsValid] = useState(true);
  const [currentAnswer, setCurrentAnswer] = useState<string>(faktum.svar ?? "");
  const [debouncedText, setDebouncedText] = useState<string>(currentAnswer);

  const faktumTexts = getFaktumTextById(props.faktum.beskrivendeId);
  const debouncedChange = useDebouncedCallback(setDebouncedText, 500);

  useEffect(() => {
    if (!isFirstRender && debouncedText !== faktum.svar) {
      const inputValue = debouncedText.length === 0 ? null : debouncedText;
      onChange ? onChange(faktum, inputValue) : saveFaktum(inputValue);
    }
  }, [debouncedText]);

  useEffect(() => {
    if (!faktum.svar) {
      setCurrentAnswer("");
    }
  }, [faktum.svar]);

  function onValueChange(event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) {
    const { value } = event.target;

    setCurrentAnswer(value);
    debouncedChange(value);
  }

  function saveFaktum(value: string | null) {
    if (value === null) {
      setIsValid(true);
      saveFaktumToQuiz(faktum, null);
      return;
    }

    if (isValidTextLength(value)) {
      setIsValid(true);
      saveFaktumToQuiz(faktum, value);
    } else {
      setIsValid(false);
    }
  }

  if (props.faktum.readOnly || props.readonly) {
    return (
      <>
        <Label>{faktumTexts ? faktumTexts.text : faktum.beskrivendeId}</Label>
        <BodyShort>{debouncedText}</BodyShort>
      </>
    );
  }

  function getErrorMessage() {
    if (unansweredFaktumId === faktum.id) {
      return getAppText("validering.faktum.ubesvart");
    } else if (!isValid) {
      return faktumTexts?.errorMessage ?? getAppText("validering.text-faktum.for-lang-tekst");
    } else {
      return undefined;
    }
  }

  return (
    <>
      {TEXTAREA_FAKTUM_IDS.includes(props.faktum.beskrivendeId) ? (
        <Textarea
          value={currentAnswer}
          label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
          description={faktumTexts?.description && <PortableText value={faktumTexts.description} />}
          onChange={onValueChange}
          onBlur={debouncedChange.flush}
          error={getErrorMessage()}
        />
      ) : (
        <TextField
          value={currentAnswer}
          label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
          description={faktumTexts?.description && <PortableText value={faktumTexts.description} />}
          size="medium"
          type="text"
          onChange={onValueChange}
          onBlur={debouncedChange.flush}
          error={getErrorMessage()}
        />
      )}
      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
    </>
  );
}
