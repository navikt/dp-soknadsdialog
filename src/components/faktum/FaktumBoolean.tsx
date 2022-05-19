import React, { useState } from "react";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { QuizBooleanFaktum } from "../../types/quiz.types";
import { getFaktumSanityText } from "../../hooks/getFaktumSanityText";
import { getSvaralternativSanityText } from "../../hooks/getSvaralternativSanityText";
import { useQuiz } from "../../context/quiz-context";

export function FaktumBoolean(props: FaktumProps<QuizBooleanFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const faktumText = getFaktumSanityText(faktum.beskrivendeId);
  const [currentAnswer, setCurrentAnswer] = useState(mapBooleanToTextId(props.faktum) || "");

  function onSelection(value: string) {
    setCurrentAnswer(value);
    saveFaktum(value);
  }

  function saveFaktum(value: string) {
    const mappedAnswer = mapTextIdToBoolean(value);

    if (mappedAnswer === undefined) {
      // TODO sentry
      // eslint-disable-next-line no-console
      console.error("ERROR");
    }

    onChange ? onChange(faktum, mappedAnswer) : saveFaktumToQuiz(faktum, mappedAnswer);
  }

  return (
    <div>
      {faktumText?.description && <PortableText value={faktumText.description} />}
      {faktumText?.helpText && <p>{faktumText.helpText.title}</p>}

      <RadioGroup
        legend={faktumText ? faktumText.text : faktum.beskrivendeId}
        onChange={onSelection}
        value={currentAnswer}
      >
        {faktum.gyldigeValg?.map((textId) => {
          const svaralternativText = getSvaralternativSanityText(textId);
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

function mapTextIdToBoolean(textId: string): boolean | undefined {
  if (textId.match(".*.svar.ja")) {
    return true;
  }

  if (textId.match(".*.svar.nei")) {
    return false;
  }

  return undefined;
}

function mapBooleanToTextId(faktum: QuizBooleanFaktum): string | undefined {
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
