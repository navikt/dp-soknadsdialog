import React, { useEffect, useState } from "react";
import { BodyShort, Label, Radio, RadioGroup } from "@navikt/ds-react";
import { IFaktum } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { IQuizBooleanFaktum } from "../../types/quiz.types";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { HelpText } from "../HelpText";
import styles from "./Faktum.module.css";
import { ISanityAlertText } from "../../types/sanity.types";
import { ErrorRetryModal } from "../error-retry-modal/ErrorRetryModal";
import { ErrorTypesEnum } from "../../types/error.types";
import { useValidation } from "../../context/validation-context";
import { AlertText } from "../alert-text/AlertText";

export function FaktumBoolean(props: IFaktum<IQuizBooleanFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { unansweredFaktumId } = useValidation();
  const { getFaktumTextById, getSvaralternativTextById, getAppText } = useSanity();
  const [currentAnswer, setCurrentAnswer] = useState<string>(booleanToTextId(props.faktum) || "");
  const [alertText, setAlertText] = useState<ISanityAlertText>();
  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);

  function onSelection(value: string) {
    setCurrentAnswer(value);
    saveFaktum(value);
  }

  useEffect(() => {
    if (currentAnswer !== "") {
      setAlertText(getSvaralternativTextById(currentAnswer)?.alertText);
    }
  }, [currentAnswer]);

  function saveFaktum(value: string) {
    const mappedAnswer = textIdToBoolean(value);

    if (mappedAnswer === undefined) {
      // TODO sentry
      // eslint-disable-next-line no-console
      console.error("ERROR");
    }

    onChange ? onChange(faktum, mappedAnswer) : saveFaktumToQuiz(faktum, mappedAnswer);
  }

  if (!faktum.beskrivendeId) {
    return <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />;
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
        {faktum.gyldigeValg?.map((textId) => {
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

export function textIdToBoolean(textId: string): boolean | undefined {
  if (textId.match(".*.svar.ja")) {
    return true;
  }

  if (textId.match(".*.svar.nei")) {
    return false;
  }

  return undefined;
}

export function booleanToTextId(faktum: IQuizBooleanFaktum): string | undefined {
  if (faktum.svar === undefined) {
    return undefined;
  }

  return faktum.gyldigeValg.find((valg) => {
    if (faktum.svar) {
      return valg.match(".*.svar.ja");
    }

    return valg.match(".*.svar.nei");
  });
}
