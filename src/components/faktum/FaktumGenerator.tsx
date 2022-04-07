import React from "react";
import { IGeneratorFaktum } from "../../types/faktum.types";
import { FaktumProps } from "./Faktum";
import { Arbeidsforhold } from "../arbeidsforhold/Arbeidsforhold";
import { Barnetillegg } from "../barnetillegg/Barnetillegg";
import styles from "./Faktum.module.css";
import { useGeneratorStateAnswers } from "../../hooks/useGeneratorStateAnswers";
import { Answer } from "../../store/answers.slice";
import { Accordion, Button } from "@navikt/ds-react";
import { GeneratorFakta } from "../generator-fakta/GeneratorFakta";
import { useGeneratorState } from "../../hooks/useGeneratorState";
import { ARBEIDSFORHOLD_FAKTUM_ID, BARN_LISTE_FAKTUM_ID } from "../../faktum.utils";

export function FaktumGenerator(props: Omit<FaktumProps<IGeneratorFaktum>, "onChange">) {
  return <div>{renderGeneratorType(props.faktum)}</div>;
}

function renderGeneratorType(faktum: IGeneratorFaktum) {
  switch (faktum.textId) {
    case ARBEIDSFORHOLD_FAKTUM_ID:
      return <Arbeidsforhold {...faktum} />;
    case BARN_LISTE_FAKTUM_ID:
      return <Barnetillegg {...faktum} />;
    default:
      return <StandardGeneratorFaktum {...faktum} />;
  }
}

function StandardGeneratorFaktum(faktum: IGeneratorFaktum) {
  const generatorAnswers = useGeneratorStateAnswers(faktum.textId);
  const { activeIndex, addNewList, toggleActiveList, isNewList, resetState, saveList, deleteList } =
    useGeneratorState();

  function handleSaveList(answers: Answer[]) {
    saveList(answers, faktum.textId);
  }

  return (
    <div>
      <Accordion>
        {generatorAnswers.map((answers, index) => (
          <Accordion.Item key={index} open={index === activeIndex}>
            <Accordion.Header onClick={() => toggleActiveList(index)}>
              {answers[0]?.value}
            </Accordion.Header>

            <Accordion.Content>
              <Button onClick={() => deleteList(faktum.textId)}>Slett svar</Button>
              <GeneratorFakta
                answers={answers}
                fakta={faktum.fakta}
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
        <GeneratorFakta fakta={faktum.fakta} save={handleSaveList} cancel={resetState} />
      )}
    </div>
  );
}
