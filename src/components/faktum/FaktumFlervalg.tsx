import React, { useState } from "react";
import { Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { QuizFlervalgFaktum } from "../../types/quiz.types";
import { useFaktumSanityText } from "../../hooks/useFaktumSanityText";
import { getSvaralternativSanityText } from "../../hooks/getSvaralternativSanityText";
import { useQuiz } from "../../context/quiz-context";

export function FaktumFlervalg(props: FaktumProps<QuizFlervalgFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();

  const faktumText = useFaktumSanityText(faktum.beskrivendeId);
  const [currentAnswer, setCurrentAnswer] = useState(props.faktum.svar || []);

  function onSelection(value: string[]) {
    onChange ? onChange(faktum, value) : saveFaktum(value);
    setCurrentAnswer(value);
  }

  function saveFaktum(value: string[]) {
    saveFaktumToQuiz(faktum, value);
  }

  return (
    <div>
      {faktumText?.description && <PortableText value={faktumText.description} />}
      {faktumText?.helpText && <p>{faktumText.helpText.title}</p>}

      <CheckboxGroup
        legend={faktumText?.text ? faktumText.text : faktum.beskrivendeId}
        onChange={onSelection}
        value={currentAnswer}
      >
        {faktum.gyldigeValg.map((textId) => {
          const svaralternativText = getSvaralternativSanityText(textId);
          return (
            <Checkbox key={textId} value={textId}>
              {svaralternativText ? svaralternativText.text : textId}
            </Checkbox>
          );
        })}
      </CheckboxGroup>
    </div>
  );
}
