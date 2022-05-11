import React from "react";
import { Accordion, Button } from "@navikt/ds-react";
import { Answer } from "../../store/answers.slice";
import { GeneratorFakta } from "../generator-fakta/GeneratorFakta";
import styles from "./Arbeidsforhold.module.css";
import { FAKTUM_ARBEIDSFORHOLD } from "../../constants";
import { useGeneratorStateAnswers } from "../../hooks/useGeneratorStateAnswers";
import { useGeneratorState } from "../../hooks/useGeneratorState";
import { QuizGeneratorFaktum } from "../../types/quiz.types";

export function Arbeidsforhold(faktum: QuizGeneratorFaktum) {
  const arbeidsforhold = useGeneratorStateAnswers(FAKTUM_ARBEIDSFORHOLD);
  const { activeIndex, addNewList, toggleActiveList, isNewList, resetState, saveList, deleteList } =
    useGeneratorState();

  function handleSaveArbeidsforhold(answers: Answer[]) {
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

function getArbeidsforholdName(arbeidsforhold: Answer[]): string {
  return (
    (arbeidsforhold.find((answer) => answer.textId === "faktum.navn-bedrift")?.value as string) ??
    "Fant ikke navn på arbeidsgiver"
  );
}
