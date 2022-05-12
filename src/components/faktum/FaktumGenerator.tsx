import React from "react";
import { Arbeidsforhold } from "../arbeidsforhold/Arbeidsforhold";
import { Barnetillegg } from "../barnetillegg/Barnetillegg";
import styles from "./Faktum.module.css";
import { Accordion, Button } from "@navikt/ds-react";
import { GeneratorFakta } from "../generator-fakta/GeneratorFakta";
import { useGeneratorState } from "../../hooks/useGeneratorState";
import { ARBEIDSFORHOLD_FAKTUM_ID, BARN_LISTE_FAKTUM_ID } from "../../faktum.utils";
import { QuizFaktum, QuizGeneratorFaktum } from "../../types/quiz.types";

export function FaktumGenerator(props: { faktum: QuizGeneratorFaktum }) {
  return <div>{renderGeneratorType(props.faktum)}</div>;
}

function renderGeneratorType(faktum: QuizGeneratorFaktum) {
  switch (faktum.beskrivendeId) {
    case ARBEIDSFORHOLD_FAKTUM_ID:
      return <Arbeidsforhold {...faktum} />;
    case BARN_LISTE_FAKTUM_ID:
      return <Barnetillegg {...faktum} />;
    default:
      return <StandardGeneratorFaktum {...faktum} />;
  }
}

function StandardGeneratorFaktum(faktum: QuizGeneratorFaktum) {
  const generatorAnswers = faktum.svar || [];
  const { activeIndex, addNewList, toggleActiveList, isNewList, resetState, saveList, deleteList } =
    useGeneratorState();

  function handleSaveList(answers: QuizFaktum[]) {
    saveList(answers, faktum.beskrivendeId);
  }

  return (
    <div>
      <Accordion>
        {generatorAnswers.map((answers, index) => (
          <Accordion.Item key={index} open={index === activeIndex}>
            <Accordion.Header onClick={() => toggleActiveList(index)}>
              {answers[0]?.svar}
            </Accordion.Header>

            <Accordion.Content>
              <Button onClick={() => deleteList(faktum.beskrivendeId)}>Slett svar</Button>
              <GeneratorFakta
                answers={answers}
                fakta={faktum.templates}
                save={handleSaveList}
                cancel={resetState}
              />
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>

      {!isNewList && (
        <Button
          className={styles["button-container"]}
          onClick={() => addNewList(generatorAnswers.length)}
        >
          Legg til svar
        </Button>
      )}

      {isNewList && (
        <GeneratorFakta fakta={faktum.templates} save={handleSaveList} cancel={resetState} />
      )}
    </div>
  );
}
