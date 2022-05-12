import React from "react";
import { Accordion, Button } from "@navikt/ds-react";
import { GeneratorFakta } from "../generator-fakta/GeneratorFakta";
import styles from "./Arbeidsforhold.module.css";
import { useGeneratorState } from "../../hooks/useGeneratorState";
import { QuizFaktum, QuizGeneratorFaktum } from "../../types/quiz.types";

export function Arbeidsforhold(faktum: QuizGeneratorFaktum) {
  const arbeidsforhold = faktum.svar || [];

  const { activeIndex, addNewList, toggleActiveList, isNewList, resetState, saveList, deleteList } =
    useGeneratorState();

  function handleSaveArbeidsforhold(answers: QuizFaktum[]) {
    saveList(answers, faktum.beskrivendeId);
  }

  return (
    <div>
      <Accordion>
        {arbeidsforhold.map((answers, index) => (
          <Accordion.Item key={index} open={index === activeIndex}>
            <Accordion.Header onClick={() => toggleActiveList(index)}>
              {getArbeidsforholdName(answers)}
            </Accordion.Header>

            <Accordion.Content>
              <Button onClick={() => deleteList(faktum.beskrivendeId)}>Slett arbeidsforhold</Button>
              <GeneratorFakta
                answers={answers}
                fakta={faktum.templates}
                save={handleSaveArbeidsforhold}
                cancel={resetState}
              />
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>

      {!isNewList && (
        <Button
          className={styles["button-container"]}
          onClick={() => addNewList(arbeidsforhold.length)}
        >
          Legg til arbreidsforhold
        </Button>
      )}

      {isNewList && (
        <GeneratorFakta
          fakta={faktum.templates}
          save={handleSaveArbeidsforhold}
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
