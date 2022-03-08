import React, { useState } from "react";
import { IGeneratorFaktum } from "../../types/faktum.types";
import { Accordion, Button } from "@navikt/ds-react";
import { Answer } from "../../store/answers.slice";
import { useDispatch } from "react-redux";
import { GeneratorFakta } from "../generator-fakta/GeneratorFakta";
import { deleteGeneratorFromQuiz, saveGeneratorStateToQuiz } from "../../store/generators.slice";
import { FAKTUM_BARNETILLEGG } from "../../constants";
import { useGeneratorStateAnswers } from "../../hooks/useGeneratorStateAnswers";

export function Barnetillegg(props: IGeneratorFaktum) {
  const dispatch = useDispatch();
  const barnetillegg = useGeneratorStateAnswers(FAKTUM_BARNETILLEGG);
  const [addNewBarnetillegg, setNewBarnetillegg] = useState(false);
  const [activeBarnetilleggIndex, setActiveBarnetilleggIndex] = useState<number | undefined>(0);

  function onSaveBarnetillegg(answers: Answer[]) {
    if (activeBarnetilleggIndex === undefined) {
      // TODO sentry
      // eslint-disable-next-line no-console
      console.error("prøver å lagre barnetilegg uten av active index er satt");
      return;
    }

    dispatch(
      saveGeneratorStateToQuiz({
        index: activeBarnetilleggIndex,
        beskrivendeId: FAKTUM_BARNETILLEGG,
        answers,
      })
    );

    resetBarnetilleggForm();
  }
  function onDeleteBarnetillegg() {
    if (activeBarnetilleggIndex === undefined) {
      // TODO sentry
      // eslint-disable-next-line no-console
      console.error("prøver å lagre arbeidsforhold uten av active index er satt");
      return;
    }
    dispatch(
      deleteGeneratorFromQuiz({
        index: activeBarnetilleggIndex,
        beskrivendeId: FAKTUM_BARNETILLEGG,
      })
    );
    resetBarnetilleggForm();
  }

  function onAddBarnetilegg() {
    if (barnetillegg.length > 0) {
      setActiveBarnetilleggIndex(() => barnetillegg.length);
    }
    setNewBarnetillegg(!addNewBarnetillegg);
  }

  function toggleActiveBarnetillegg(index: number) {
    setNewBarnetillegg(false);

    if (index === activeBarnetilleggIndex) {
      setActiveBarnetilleggIndex(undefined);
    } else {
      setActiveBarnetilleggIndex(index);
    }
  }

  function resetBarnetilleggForm() {
    setNewBarnetillegg(false);
    setActiveBarnetilleggIndex(undefined);
  }

  return (
    <div>
      <Accordion>
        {barnetillegg.map((answers, index) => (
          <Accordion.Item key={index} open={index === activeBarnetilleggIndex}>
            <Accordion.Header onClick={() => toggleActiveBarnetillegg(index)}>
              {getChildName(answers)}
            </Accordion.Header>

            <Accordion.Content>
              <Button onClick={() => onDeleteBarnetillegg()}>Slett barn</Button>
              <GeneratorFakta
                answers={answers}
                fakta={props.faktum}
                save={onSaveBarnetillegg}
                cancel={resetBarnetilleggForm}
              />
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>

      {!addNewBarnetillegg && (
        <Button className={"lol"} onClick={onAddBarnetilegg}>
          Legg til barnetillegg
        </Button>
      )}

      {addNewBarnetillegg && (
        <GeneratorFakta
          fakta={props.faktum}
          save={onSaveBarnetillegg}
          cancel={resetBarnetilleggForm}
        />
      )}
    </div>
  );
}

function getChildName(barnetillegg: Answer[]): string {
  const firstName = barnetillegg.find(
    (answer) => answer.beskrivendeId === "faktum.barn-fornavn-mellomnavn"
  )?.value as string;

  const lastName = barnetillegg.find((answer) => answer.beskrivendeId === "faktum.barn-etternavn")
    ?.value as string;

  return `${firstName} ${lastName}`;
}
