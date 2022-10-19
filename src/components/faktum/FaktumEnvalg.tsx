import React, { useState, useEffect } from "react";
import { BodyShort, Label, Radio, RadioGroup } from "@navikt/ds-react";
import { IFaktum } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { IQuizEnvalgFaktum } from "../../types/quiz.types";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { HelpText } from "../HelpText";
import styles from "./Faktum.module.css";
import { AlertText } from "../AlertText";
import { ISanityAlertText } from "../../types/sanity.types";
import { useValidation } from "../../context/validation-context";

export function FaktumEnvalg(props: IFaktum<IQuizEnvalgFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { unansweredFaktumId } = useValidation();
  const { getFaktumTextById, getSvaralternativTextById, getAppText } = useSanity();
  const [currentAnswer, setCurrentAnswer] = useState<string>(faktum.svar || "");
  const [alertText, setAlertText] = useState<ISanityAlertText>();
  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);

  useEffect(() => {
    if (currentAnswer !== "") {
      setAlertText(getSvaralternativTextById(currentAnswer)?.alertText);
    }
  }, [currentAnswer]);

  function onSelection(value: string) {
    setCurrentAnswer(value);
    saveFaktum(value);
  }

  function saveFaktum(value: string) {
    onChange ? onChange(faktum, value) : saveFaktumToQuiz(faktum, value);
  }

  if (props.faktum.readOnly || props.readonly) {
    return (
      <>
        <Label>{faktumTexts ? faktumTexts.text : faktum.beskrivendeId}</Label>
        <BodyShort>{getSvaralternativTextById(currentAnswer)?.text || currentAnswer}</BodyShort>
      </>
    );
  }

  return (
    <>
      <RadioGroup
        legend={faktumTexts ? faktumTexts.text : faktum.beskrivendeId}
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
            <div key={textId}>
              <Radio value={textId}>{svaralternativText ? svaralternativText.text : textId}</Radio>
            </div>
          );
        })}
      </RadioGroup>
      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
      {alertText && <AlertText alertText={alertText} spacingTop />}
    </>
  );
}
