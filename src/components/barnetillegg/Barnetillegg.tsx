import React from "react";
import { Accordion, Button } from "@navikt/ds-react";
import { GeneratorSkjema } from "../generator-skjema/GeneratorSkjema";
import { useGeneratorState } from "../../hooks/useGeneratorState";
import { QuizFaktum, QuizGeneratorFaktum } from "../../types/quiz.types";

export function Barnetillegg(generatorFaktum: QuizGeneratorFaktum) {
  const {
    resetState,
    saveSkjema,
    activeIndex,
    addNewSkjema,
    deleteSkjema,
    generatorSvar,
    toggleActiveSkjema,
    isNewGeneratorSkjema,
  } = useGeneratorState(generatorFaktum.svar);

  return (
    <div>
      <Accordion>
        {generatorSvar.map((faktum, index) => (
          <Accordion.Item key={index} open={index === activeIndex}>
            <Accordion.Header onClick={() => toggleActiveSkjema(index)}>
              {getChildName(faktum)}
            </Accordion.Header>

            <Accordion.Content>
              <Button onClick={() => deleteSkjema()}>Slett barn</Button>
              <GeneratorSkjema
                templates={generatorFaktum.templates}
                svar={faktum}
                save={(svar) => saveSkjema(generatorFaktum, svar)}
                cancel={resetState}
              />
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>

      {!isNewGeneratorSkjema && (
        <Button onClick={() => addNewSkjema(generatorSvar.length)}>Legg til barnetillegg</Button>
      )}

      {isNewGeneratorSkjema && (
        <GeneratorSkjema
          svar={[]}
          templates={generatorFaktum.templates}
          save={(svar) => saveSkjema(generatorFaktum, svar)}
          cancel={resetState}
        />
      )}
    </div>
  );
}

function getChildName(barnetillegg: QuizFaktum[]): string {
  const firstName = barnetillegg.find(
    (svar) => svar.beskrivendeId === "faktum.barn-fornavn-mellomnavn"
  )?.svar as string;

  const lastName = barnetillegg.find((svar) => svar.beskrivendeId === "faktum.barn-etternavn")
    ?.svar as string;

  return `${firstName} ${lastName}`;
}
