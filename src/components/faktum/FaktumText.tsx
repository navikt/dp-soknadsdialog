import React, { useEffect, useState } from "react";
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
import styles from "./Faktum.module.css";

export function FaktumText(props: IFaktum<IQuizTekstFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { unansweredFaktumId } = useValidation();
  const { getAppTekst } = useSanity();
  const faktumTexts = useSanity().getFaktumTextById(props.faktum.beskrivendeId);

  const [debouncedText, setDebouncedText] = useState(faktum.svar || "");
  const [isValid, setIsValid] = useState(true);

  const debouncedChange = useDebouncedCallback(setDebouncedText, 500);

  useEffect(() => {
    if (debouncedText && debouncedText !== faktum.svar) {
      onChange ? onChange(faktum, debouncedText) : saveFaktum(debouncedText);
    }
  }, [debouncedText]);

  function saveFaktum(value: string) {
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
      return getAppTekst("validering.faktum.ubesvart");
    } else if (!isValid) {
      return faktumTexts?.errorMessage ?? getAppTekst("validering.text-faktum.for-lang-tekst");
    } else {
      return undefined;
    }
  }

  return (
    <>
      {TEXTAREA_FAKTUM_IDS.includes(props.faktum.beskrivendeId) ? (
        <Textarea
          defaultValue={faktum?.svar}
          label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
          description={faktumTexts?.description && <PortableText value={faktumTexts.description} />}
          onChange={(event) => debouncedChange(event.currentTarget.value)}
          onBlur={debouncedChange.flush}
          error={getErrorMessage()}
        />
      ) : (
        <TextField
          defaultValue={faktum?.svar}
          label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
          description={faktumTexts?.description && <PortableText value={faktumTexts.description} />}
          size="medium"
          type="text"
          onChange={(event) => debouncedChange(event.currentTarget.value)}
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
