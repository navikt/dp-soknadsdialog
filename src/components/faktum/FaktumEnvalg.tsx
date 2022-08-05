import React, { useState, useEffect } from "react";
import { BodyShort, Label, Radio, RadioGroup } from "@navikt/ds-react";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { QuizEnvalgFaktum } from "../../types/quiz.types";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { HelpText } from "../HelpText";
import styles from "./Faktum.module.css";
import { AlertText } from "../AlertText";
import { SanityAlertText } from "../../types/sanity.types";

export function FaktumEnvalg(props: FaktumProps<QuizEnvalgFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { getFaktumTextById, getSvaralternativTextById } = useSanity();
  const [currentAnswer, setCurrentAnswer] = useState<string>(faktum.svar || "");
  const [alertText, setAlertText] = useState<SanityAlertText>();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);

  useEffect(() => {
    if (currentAnswer !== "") {
      setShowAlert(!!getSvaralternativTextById(currentAnswer)?.alertTextIsActive);
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
      {showAlert && alertText && <AlertText alertText={alertText} />}
    </>
  );
}
