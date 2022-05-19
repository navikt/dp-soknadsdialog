import React from "react";
import { Accordion, Button } from "@navikt/ds-react";
import { GeneratorSkjema } from "../generator-skjema/GeneratorSkjema";
import { useGeneratorState } from "../../hooks/useGeneratorState";
import { QuizFaktum, QuizGeneratorFaktum } from "../../types/quiz.types";
import styles from "./Arbeidsforhold.module.css";

export function Arbeidsforhold(generatorFaktum: QuizGeneratorFaktum) {
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
              {getArbeidsforholdName(faktum)}
            </Accordion.Header>

            <Accordion.Content>
              <Button onClick={() => deleteSkjema()}>Slett arbeidsforhold</Button>
              <GeneratorSkjema
                svar={faktum}
                cancel={resetState}
                templates={generatorFaktum.templates}
                save={(svar) => saveSkjema(generatorFaktum, svar)}
              />
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>

      {!isNewGeneratorSkjema && (
        <Button
          className={styles["button-container"]}
          onClick={() => addNewSkjema(generatorSvar.length)}
        >
          Legg til arbreidsforhold
        </Button>
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

function getArbeidsforholdName(arbeidsforhold: QuizFaktum[]): string {
  return (
    (arbeidsforhold.find((answer) => answer.beskrivendeId === "faktum.navn-bedrift")
      ?.svar as string) ?? "Fant ikke navn på arbeidsgiver"
  );
}
