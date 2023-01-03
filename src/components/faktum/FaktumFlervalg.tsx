import { BodyShort, Checkbox, CheckboxGroup, Label } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { forwardRef, Ref, useEffect, useState } from "react";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { useFirstRender } from "../../hooks/useFirstRender";
import { IQuizFlervalgFaktum } from "../../types/quiz.types";
import { ISanityAlertText } from "../../types/sanity.types";
import { isDefined } from "../../types/type-guards";
import { AlertText } from "../alert-text/AlertText";
import { HelpText } from "../HelpText";
import { IFaktum } from "./Faktum";
import styles from "./Faktum.module.css";

export const FaktumFlervalg = forwardRef(FaktumFlervalgComponent);

function FaktumFlervalgComponent(
  props: IFaktum<IQuizFlervalgFaktum>,
  ref: Ref<HTMLFieldSetElement> | undefined
) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const isFirstRender = useFirstRender();
  const { unansweredFaktumId } = useValidation();
  const { getFaktumTextById, getSvaralternativTextById, getAppText } = useSanity();
  const [alertText, setAlertText] = useState<ISanityAlertText[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState(props.faktum.svar || []);

  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);

  useEffect(() => {
    const alertTexts = currentAnswer
      .map((answer) => getSvaralternativTextById(answer)?.alertText)
      .filter(isDefined);

    setAlertText(alertTexts);
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

  if (props.faktum.readOnly || props.readonly) {
    return (
      <>
        <Label>{faktumTexts ? faktumTexts.text : faktum.beskrivendeId}</Label>
        {currentAnswer.map((textId) => (
          <BodyShort key={textId}>{getSvaralternativTextById(textId)?.text || textId}</BodyShort>
        ))}
      </>
    );
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

      {alertText.map((sanityText, index) => {
        return (
          (sanityText?.body || sanityText?.title) && (
            <AlertText key={index} alertText={sanityText} spacingTop />
          )
        );
      })}
    </>
  );
}
