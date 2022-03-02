import React, { useState } from "react";
import { IGeneratorFaktum } from "../../types/faktum.types";
import { Accordion, Button } from "@navikt/ds-react";
import { Answer } from "../../store/answers.slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { GeneratorFakta } from "../generator-fakta/GeneratorFakta";
import { deleteBarnetilleggFromQuiz, saveBarnetileggToQuiz } from "../../store/barnetillegg.slice";
import { IGeneratorAnswer } from "../../store/generator-utils";

export function Barnetillegg(props: IGeneratorFaktum) {
  const dispatch = useDispatch();
  const barnetillegg = useSelector((state: RootState) => state.barnetillegg.answers);
  const [addNewBarnetillegg, setNewBarnetillegg] = useState(false);
  const [activeBarnetilleggIndex, setActiveBarnetilleggIndex] = useState<number | undefined>(0);

  function onSaveBarnetillegg(answers: Answer[]) {
    if (activeBarnetilleggIndex === undefined) {
      // TODO sentry
      // eslint-disable-next-line no-console
      console.error("prøver å lagre barnetilegg uten av active index er satt");
      return;
    }

    dispatch(saveBarnetileggToQuiz({ index: activeBarnetilleggIndex, answers }));

    resetBarnetilleggForm();
  }
  function onDeleteBarnetillegg() {
    if (activeBarnetilleggIndex === undefined) {
      // TODO sentry
      // eslint-disable-next-line no-console
      console.error("prøver å lagre arbeidsforhold uten av active index er satt");
      return;
    }
    dispatch(deleteBarnetilleggFromQuiz(activeBarnetilleggIndex));
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
        {barnetillegg.map((barnetilegg, index) => (
          <Accordion.Item key={index} open={index === activeBarnetilleggIndex}>
            <Accordion.Header onClick={() => toggleActiveBarnetillegg(index)}>
              {getChildName(barnetilegg)}
            </Accordion.Header>

            <Accordion.Content>
              <Button onClick={() => onDeleteBarnetillegg()}>Slett barn</Button>
              <GeneratorFakta
                answers={barnetilegg.answers}
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

function getChildName(barnetillegg: IGeneratorAnswer): string {
  const firstName = barnetillegg.answers.find(
    (answer) => answer.beskrivendeId === "faktum.barn-fornavn-mellomnavn"
  )?.answer as string;

  const lastName = barnetillegg.answers.find(
    (answer) => answer.beskrivendeId === "faktum.barn-etternavn"
  )?.answer as string;

  return `${firstName} ${lastName}`;
}
