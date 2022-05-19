import React from "react";
import { Accordion, Button } from "@navikt/ds-react";
import { GeneratorFakta } from "../generator-fakta/GeneratorFakta";
import { useGeneratorState } from "../../hooks/useGeneratorState";
import { QuizFaktum, QuizGeneratorFaktum } from "../../types/quiz.types";

export function Barnetillegg(faktum: QuizGeneratorFaktum) {
  const barnetillegg = faktum.svar || [];
  const { activeIndex, addNewList, toggleActiveList, isNewList, resetState, saveList, deleteList } =
    useGeneratorState();

  function handleSaveBarnetillegg(answers: QuizFaktum[]) {
    saveList(answers, faktum.beskrivendeId);
  }

  return (
    <div>
      <Accordion>
        {barnetillegg.map((answers, index) => (
          <Accordion.Item key={index} open={index === activeIndex}>
            <Accordion.Header onClick={() => toggleActiveList(index)}>
              {getChildName(answers)}
            </Accordion.Header>

            <Accordion.Content>
              <Button onClick={() => deleteList(faktum.beskrivendeId)}>Slett barn</Button>
              <GeneratorFakta
                fakta={faktum.templates}
                save={handleSaveBarnetillegg}
                cancel={resetState}
              />
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>

      {!isNewList && (
        <Button onClick={() => addNewList(barnetillegg.length)}>Legg til barnetillegg</Button>
      )}

      {isNewList && (
        <GeneratorFakta
          fakta={faktum.templates}
          save={handleSaveBarnetillegg}
          cancel={resetState}
        />
      )}
    </div>
  );
}

function getChildName(barnetillegg: QuizFaktum[]): string {
  const firstName = barnetillegg.find(
    (answer) => answer.beskrivendeId === "faktum.barn-fornavn-mellomnavn"
  )?.svar as string;

  const lastName = barnetillegg.find((answer) => answer.beskrivendeId === "faktum.barn-etternavn")
    ?.svar as string;

  return `${firstName} ${lastName}`;
}
