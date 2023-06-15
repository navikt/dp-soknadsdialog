import React, { ChangeEvent, forwardRef, Ref, useEffect, useState } from "react";
import { Textarea, TextField } from "@navikt/ds-react";
import { TEXTAREA_FAKTUM_IDS } from "../../../constants";
import { IFaktum } from "../Faktum";
import { IQuizTekstFaktum } from "../../../types/quiz.types";
import { PortableText } from "@portabletext/react";
import { useDebouncedCallback } from "../../../hooks/useDebouncedCallback";
import { useQuiz } from "../../../context/quiz-context";
import { useSanity } from "../../../context/sanity-context";
import { HelpText } from "../../HelpText";
import { isValidTextLength } from "../validation/validations.utils";
import { useValidation } from "../../../context/validation-context";
import { useFirstRender } from "../../../hooks/useFirstRender";
import styles from "../Faktum.module.css";

export const FaktumText = forwardRef(FaktumTextComponent);

const containsOnlyWhitespace = (debouncedText: string): boolean => {
  // trim er brukt for å sjekke om string inneholder kun whitespace. Hvis kun whitespace, gjør ingenting.
  // vi skal bare gjøre sjekken hvis det er noe i stringen
  const stringNotEmpty: boolean = debouncedText.length > 0;

  return stringNotEmpty && debouncedText.trim() ? true : false;
};

export function FaktumTextComponent(
  props: IFaktum<IQuizTekstFaktum>,
  ref: Ref<HTMLInputElement> | undefined
) {
  const { faktum } = props;
  const isFirstRender = useFirstRender();
  const { saveFaktumToQuiz, isLocked } = useQuiz();
  const { unansweredFaktumId } = useValidation();
  const { getAppText, getFaktumTextById } = useSanity();

  const [hasError, setHasError] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string>(faktum.svar ?? "");
  const [debouncedText, setDebouncedText] = useState<string>(currentAnswer);

  const faktumTexts = getFaktumTextById(props.faktum.beskrivendeId);
  const debouncedChange = useDebouncedCallback(setDebouncedText, 500);

  useEffect(() => {
    if (!isFirstRender && debouncedText !== faktum.svar) {
      // backend tillater ikke string med bare whitespace, avgir bad request som gir en dårlig tilbakemelding til bruker
      if (containsOnlyWhitespace(debouncedText)) {
        return;
      }
      const inputValue = debouncedText.length === 0 ? null : debouncedText;
      saveFaktum(inputValue);
    }
  }, [debouncedText]);

  function onValueChange(event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) {
    const { value } = event.target;

    setCurrentAnswer(value);
    debouncedChange(value);
  }

  function saveFaktum(value: string | null) {
    if (value === null) {
      setHasError(false);
      saveFaktumToQuiz(faktum, null);
      return;
    }

    if (!isValidTextLength(value)) {
      setHasError(true);
      return;
    } else {
      setHasError(false);
      saveFaktumToQuiz(faktum, value);
    }
  }

  function getErrorMessage() {
    if (unansweredFaktumId === faktum.id) {
      return getAppText("validering.faktum.ubesvart");
    } else if (hasError) {
      return faktumTexts?.errorMessage ?? getAppText("validering.text-faktum.for-lang-tekst");
    } else {
      return undefined;
    }
  }

  return (
    <>
      {TEXTAREA_FAKTUM_IDS.includes(props.faktum.beskrivendeId) ? (
        <Textarea
          ref={ref as Ref<HTMLTextAreaElement> | undefined}
          tabIndex={-1}
          value={currentAnswer}
          label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
          description={faktumTexts?.description && <PortableText value={faktumTexts.description} />}
          onChange={onValueChange}
          onBlur={debouncedChange.flush}
          error={getErrorMessage()}
          disabled={isLocked}
        />
      ) : (
        <TextField
          ref={ref}
          tabIndex={-1}
          value={currentAnswer}
          label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
          description={faktumTexts?.description && <PortableText value={faktumTexts.description} />}
          size="medium"
          type="text"
          onChange={onValueChange}
          onBlur={debouncedChange.flush}
          error={getErrorMessage()}
          disabled={isLocked}
        />
      )}

      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
    </>
  );
}
