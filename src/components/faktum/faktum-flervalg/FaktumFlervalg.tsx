import React, { useEffect, useState } from "react";
import { Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { IFaktum } from "../Faktum";
import { PortableText } from "@portabletext/react";
import { IQuizFlervalgFaktum } from "../../../types/quiz.types";
import { useQuiz } from "../../../context/quiz-context";
import { useSanity } from "../../../context/sanity-context";
import { HelpText } from "../../HelpText";
import { useValidation } from "../../../context/validation-context";
import { useFirstRender } from "../../../hooks/useFirstRender";
import { ISanityAlertText } from "../../../types/sanity.types";
import { AlertText } from "../../alert-text/AlertText";
import { isDefined } from "../../../types/type-guards";
import styles from "../Faktum.module.css";

export function FaktumFlervalg(props: IFaktum<IQuizFlervalgFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const isFirstRender = useFirstRender();
  const { unansweredFaktumId } = useValidation();
  const { getFaktumTextById, getSvaralternativTextById, getAppText } = useSanity();
  const [alertTexts, setAlertTexts] = useState<ISanityAlertText[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState(props.faktum.svar || []);

  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);

  useEffect(() => {
    const alertTexts = currentAnswer
      .map((answer) => getSvaralternativTextById(answer)?.alertText)
      .filter(isDefined);

    setAlertTexts(alertTexts);
  }, [currentAnswer]);

  useEffect(() => {
    if (faktum.svar === undefined && !isFirstRender) {
      setCurrentAnswer([]);
    }
  }, [faktum.svar]);

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
        legend={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
        description={faktumTexts?.description && <PortableText value={faktumTexts.description} />}
        onChange={onSelection}
        value={currentAnswer}
        error={
          unansweredFaktumId === faktum.id ? getAppText("validering.faktum.ubesvart") : undefined
        }
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
