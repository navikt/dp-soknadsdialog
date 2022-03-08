import React, { useState } from "react";
import { IGeneratorFaktum } from "../../types/faktum.types";
import { FaktumProps } from "./Faktum";
import { Arbeidsforhold } from "../arbeidsforhold/Arbeidsforhold";
import { Barnetillegg } from "../barnetillegg/Barnetillegg";
import styles from "./Faktum.module.css";
import { useDispatch } from "react-redux";
import { useGeneratorStateAnswers } from "../../hooks/useGeneratorStateAnswers";
import { Answer } from "../../store/answers.slice";
import { deleteGeneratorFromQuiz, saveGeneratorStateToQuiz } from "../../store/generators.slice";
import { Accordion, Button } from "@navikt/ds-react";
import { GeneratorFakta } from "../generator-fakta/GeneratorFakta";

export function FaktumGenerator(props: Omit<FaktumProps<IGeneratorFaktum>, "onChange">) {
  return <div>{renderListType(props.faktum)}</div>;
}

function renderListType(faktum: IGeneratorFaktum) {
  switch (faktum.listType) {
    case "Arbeidsforhold":
      return <Arbeidsforhold {...faktum} />;
    case "Barn":
      return <Barnetillegg {...faktum} />;
    case "Standard":
      return <StandardGeneratorFaktum {...faktum} />;
    default:
      return <StandardGeneratorFaktum {...faktum} />;
  }
}

function StandardGeneratorFaktum(faktum: IGeneratorFaktum) {
  const dispatch = useDispatch();
  const generatorAnswers = useGeneratorStateAnswers(faktum.beskrivendeId);
  const [addNewList, setAddNewList] = useState(false);
  const [activeAnswerIndex, setActiveAnswerIndex] = useState<number | undefined>(0);

  function handleSaveList(answers: Answer[]) {
    if (activeAnswerIndex === undefined) {
      // TODO sentry
      // eslint-disable-next-line no-console
      console.error("prøver å lagre arbeidsforhold uten av active index er satt");
      return;
    }

    dispatch(
      saveGeneratorStateToQuiz({
        index: activeAnswerIndex,
        beskrivendeId: faktum.beskrivendeId,
        answers,
      })
    );
    resetList();
  }

  function handleDeleteList() {
    if (activeAnswerIndex === undefined) {
      // TODO sentry
      // eslint-disable-next-line no-console
      console.error("prøver å lagre arbeidsforhold uten av active index er satt");
      return;
    }
    dispatch(
      deleteGeneratorFromQuiz({
        index: activeAnswerIndex,
        beskrivendeId: faktum.beskrivendeId,
      })
    );
    resetList();
  }

  function handleAddNewList() {
    if (generatorAnswers.length > 0) {
      setActiveAnswerIndex(() => generatorAnswers.length);
    }
    setAddNewList(!addNewList);
  }

  function toggleActiveList(index: number) {
    setAddNewList(false);

    if (index === activeAnswerIndex) {
      setActiveAnswerIndex(undefined);
    } else {
      setActiveAnswerIndex(index);
    }
  }

  function resetList() {
    setAddNewList(false);
    setActiveAnswerIndex(undefined);
  }

  return (
    <div>
      <Accordion>
        {generatorAnswers.map((answers, index) => {
          return (
            <Accordion.Item key={index} open={index === activeAnswerIndex}>
              <Accordion.Header onClick={() => toggleActiveList(index)}>
                {answers[0]?.value}
              </Accordion.Header>

              <Accordion.Content>
                <Button onClick={() => handleDeleteList()}>Slett svar</Button>
                <GeneratorFakta
                  answers={answers}
                  fakta={faktum.faktum}
                  save={handleSaveList}
                  cancel={resetList}
                />
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </Accordion>

      {!addNewList && (
        <Button className={styles["button-container"]} onClick={handleAddNewList}>
          Legg til svar
        </Button>
      )}

      {addNewList && (
        <GeneratorFakta fakta={faktum.faktum} save={handleSaveList} cancel={resetList} />
      )}
    </div>
  );
}
