import React, { useEffect, useState, forwardRef, Ref } from "react";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { IFaktum } from "../Faktum";
import { IQuizBooleanFaktum } from "../../../types/quiz.types";
import { ISanityAlertText } from "../../../types/sanity.types";
import { ErrorTypesEnum } from "../../../types/error.types";
import { PortableText } from "@portabletext/react";
import { useQuiz } from "../../../context/quiz-context";
import { useSanity } from "../../../context/sanity-context";
import { HelpText } from "../../HelpText";
import { ErrorRetryModal } from "../../error-retry-modal/ErrorRetryModal";
import { useValidation } from "../../../context/validation-context";
import { AlertText } from "../../alert-text/AlertText";
import { useFirstRender } from "../../../hooks/useFirstRender";
import styles from "../Faktum.module.css";

export const FaktumBoolean = forwardRef(FaktumBooleanComponent);

function FaktumBooleanComponent(
  props: IFaktum<IQuizBooleanFaktum>,
  ref: Ref<HTMLFieldSetElement> | undefined
) {
  const { faktum } = props;
  const isFirstRender = useFirstRender();
  const { saveFaktumToQuiz } = useQuiz();
  const { unansweredFaktumId } = useValidation();
  const { getFaktumTextById, getSvaralternativTextById, getAppText } = useSanity();
  const [currentAnswer, setCurrentAnswer] = useState<string>(booleanToTextId(props.faktum) || "");
  const [alertText, setAlertText] = useState<ISanityAlertText>();
  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);

  useEffect(() => {
    if (currentAnswer !== "") {
      setAlertText(getSvaralternativTextById(currentAnswer)?.alertText);
    }
  }, [currentAnswer]);

  useEffect(() => {
    if (faktum.svar === undefined && !isFirstRender) {
      setCurrentAnswer("");
    }
  }, [faktum.svar]);

  function onSelection(value: string) {
    setCurrentAnswer(value);
    saveFaktum(value);
  }

  function saveFaktum(value: string) {
    const mappedAnswer = textIdToBoolean(value);

    if (mappedAnswer === undefined) {
      // TODO sentry
      // eslint-disable-next-line no-console
      console.error("ERROR");
    }

    saveFaktumToQuiz(faktum, mappedAnswer);
  }

  if (!faktum.beskrivendeId) {
    return <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />;
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
