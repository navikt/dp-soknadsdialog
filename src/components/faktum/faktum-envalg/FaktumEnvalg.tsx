import React, { forwardRef, Ref, useEffect, useState } from "react";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { IFaktum } from "../Faktum";
import { ISanityAlertText } from "../../../types/sanity.types";
import { IQuizEnvalgFaktum } from "../../../types/quiz.types";
import { PortableText } from "@portabletext/react";
import { useQuiz } from "../../../context/quiz-context";
import { useSanity } from "../../../context/sanity-context";
import { HelpText } from "../../HelpText";
import { useValidation } from "../../../context/validation-context";
import { AlertText } from "../../alert-text/AlertText";
import { useFirstRender } from "../../../hooks/useFirstRender";
import styles from "../Faktum.module.css";

export const FaktumEnvalg = forwardRef(FaktumEnvalgComponent);

function FaktumEnvalgComponent(
  props: IFaktum<IQuizEnvalgFaktum>,
  ref: Ref<HTMLFieldSetElement> | undefined
) {
  const { faktum, onChange } = props;
  const isFirstRender = useFirstRender();
  const { saveFaktumToQuiz, isLocked } = useQuiz();
  const { unansweredFaktumId } = useValidation();
  const { getFaktumTextById, getSvaralternativTextById, getAppText } = useSanity();
  const [currentAnswer, setCurrentAnswer] = useState<string>(faktum.svar ?? "");
  const [alertText, setAlertText] = useState<ISanityAlertText>();
  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);

  useEffect(() => {
    if (currentAnswer !== "") {
      setAlertText(getSvaralternativTextById(currentAnswer)?.alertText);
    }
  }, [currentAnswer]);

  // Used to reset current answer to what the backend state is if there is a mismatch
  useEffect(() => {
    if (!isFirstRender && faktum.svar !== currentAnswer) {
      setCurrentAnswer(faktum.svar ?? "");
    }
  }, [faktum]);

  function onSelection(value: string) {
    setCurrentAnswer(value);
    saveFaktum(value);
  }

  function saveFaktum(value: string) {
    onChange ? onChange(faktum, value) : saveFaktumToQuiz(faktum, value);
  }

  return (
    <>
      <RadioGroup
        ref={ref}
        tabIndex={-1}
        legend={faktumTexts ? faktumTexts.text : faktum.beskrivendeId}
        description={faktumTexts?.description && <PortableText value={faktumTexts.description} />}
        onChange={onSelection}
        value={currentAnswer}
        error={
          unansweredFaktumId === faktum.id ? getAppText("validering.faktum.ubesvart") : undefined
        }
        disabled={isLocked}
      >
        {faktum.gyldigeValg.map((textId) => {
          const svaralternativText = getSvaralternativTextById(textId);
          return (
            <div key={textId}>
              <Radio value={textId}>{svaralternativText ? svaralternativText.text : textId}</Radio>
            </div>
          );
        })}
      </RadioGroup>

      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}

      {(alertText?.body || alertText?.title) && <AlertText alertText={alertText} spacingTop />}
    </>
  );
}
