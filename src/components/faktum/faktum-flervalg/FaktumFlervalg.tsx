import React, { forwardRef, Ref, useEffect, useState } from "react";
import { Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { IFaktum } from "../Faktum";
import { IQuizFlervalgFaktum } from "../../../types/quiz.types";
import { ISanityAlertText } from "../../../types/sanity.types";
import { PortableText } from "@portabletext/react";
import { useQuiz } from "../../../context/quiz-context";
import { useSanity } from "../../../context/sanity-context";
import { HelpText } from "../../HelpText";
import { useValidation } from "../../../context/validation-context";
import { useFirstRender } from "../../../hooks/useFirstRender";
import { AlertText } from "../../alert-text/AlertText";
import { isDefined } from "../../../types/type-guards";
import styles from "../Faktum.module.css";

export const FaktumFlervalg = forwardRef(FaktumFlervalgComponent);

function FaktumFlervalgComponent(
  props: IFaktum<IQuizFlervalgFaktum>,
  ref: Ref<HTMLFieldSetElement> | undefined
) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz, isLocked } = useQuiz();
  const isFirstRender = useFirstRender();
  const { unansweredFaktumId } = useValidation();
  const { getFaktumTextById, getSvaralternativTextById, getAppText } = useSanity();
  const [alertTexts, setAlertTexts] = useState<ISanityAlertText[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState(faktum.svar ?? []);

  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);

  useEffect(() => {
    const alertTexts = currentAnswer
      .map((answer) => getSvaralternativTextById(answer)?.alertText)
      .filter(isDefined);

    setAlertTexts(alertTexts);
  }, [currentAnswer]);

  // Used to reset current answer to what the backend state is if there is a mismatch
  useEffect(() => {
    if (!isFirstRender) {
      const previousAnswerString = JSON.stringify(currentAnswer);
      const currentAnswerString = JSON.stringify(faktum.svar);

      if (previousAnswerString !== currentAnswerString) {
        setCurrentAnswer(faktum.svar ?? []);
      }
    }
  }, [faktum]);

  function onSelection(value: string[]) {
    onChange ? onChange(faktum, value) : saveFaktum(value);
    setCurrentAnswer(value);
  }

  function saveFaktum(value: string[]) {
    saveFaktumToQuiz(faktum, value.length > 0 ? value : null);
  }

  return (
    <>
      <CheckboxGroup
        ref={ref}
        tabIndex={-1}
        legend={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
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
            <Checkbox key={textId} value={textId}>
              {svaralternativText ? svaralternativText.text : textId}
            </Checkbox>
          );
        })}
      </CheckboxGroup>

      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}

      {alertTexts.map((sanityText, index) => {
        return (
          (sanityText?.body || sanityText?.title) && (
            <AlertText key={index} alertText={sanityText} spacingTop />
          )
        );
      })}
    </>
  );
}
