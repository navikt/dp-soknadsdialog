import React, { useState } from "react";
import { Radio, RadioGroup, Label, BodyShort } from "@navikt/ds-react";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { QuizBooleanFaktum } from "../../types/quiz.types";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";

export function FaktumBoolean(props: FaktumProps<QuizBooleanFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { getFaktumTextById, getSvaralternativTextById } = useSanity();
  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const [currentAnswer, setCurrentAnswer] = useState(booleanToTextId(props.faktum) || "");

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

    onChange ? onChange(faktum, mappedAnswer) : saveFaktumToQuiz(faktum, mappedAnswer);
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
    <div>
      {faktumTexts?.description && <PortableText value={faktumTexts.description} />}
      {faktumTexts?.helpText && <p>{faktumTexts.helpText.title}</p>}

      <RadioGroup
        legend={faktumTexts ? faktumTexts.text : faktum.beskrivendeId}
        onChange={onSelection}
        value={currentAnswer}
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
    </div>
  );
}

function textIdToBoolean(textId: string): boolean | undefined {
  if (textId.match(".*.svar.ja")) {
    return true;
  }

  if (textId.match(".*.svar.nei")) {
    return false;
  }

  return undefined;
}

export function booleanToTextId(faktum: QuizBooleanFaktum): string | undefined {
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
