import React, { useState } from "react";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { QuizEnvalgFaktum } from "../../types/quiz.types";
import { useFaktumSanityText } from "../../hooks/useFaktumSanityText";
import { getSvaralternativSanityText } from "../../hooks/getSvaralternativSanityText";
import { useQuiz } from "../../context/quiz-context";

export function FaktumEnvalg(props: FaktumProps<QuizEnvalgFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const faktumText = useFaktumSanityText(faktum.beskrivendeId);
  const [currentAnswer, setCurrentAnswer] = useState(props.faktum.svar || "");

  function onSelection(value: string) {
    setCurrentAnswer(value);
    saveFaktum(value);
  }

  function saveFaktum(value: string) {
    onChange ? onChange(faktum, value) : saveFaktumToQuiz(faktum, value);
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
        {faktum.gyldigeValg.map((textId) => {
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
