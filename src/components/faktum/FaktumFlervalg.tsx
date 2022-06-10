import React, { useState } from "react";
import { Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { QuizFlervalgFaktum } from "../../types/quiz.types";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";

export function FaktumFlervalg(props: FaktumProps<QuizFlervalgFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { getFaktumTextById, getSvaralternativTextById } = useSanity();
  const faktumText = getFaktumTextById(faktum.beskrivendeId);
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
          const svaralternativText = getSvaralternativTextById(textId);
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
