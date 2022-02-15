import React, { useState } from "react";
import { IGeneratorFaktum } from "../../types/faktum.types";
import { Accordion, Button } from "@navikt/ds-react";
import { IGeneratorAnswers } from "../../store/arbeidsforhold.slice";
import { Answer } from "../../store/answers.slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { GeneratorFakta } from "../generator-fakta/GeneratorFakta";
import { deleteBarnetillegg, saveBarnetillegg } from "../../store/barnetillegg.slice";

export function Barnetillegg(props: IGeneratorFaktum) {
  const dispatch = useDispatch();
  const barnetillegg = useSelector((state: RootState) => state.barnetillegg);
  const [addNewBarnetillegg, setNewBarnetillegg] = useState(false);
  const [activeBarnetilleggIndex, setActiveBarnetilleggIndex] = useState<number | undefined>(0);

  function onSaveBarnetillegg(answers: Answer[]) {
    dispatch(
      saveBarnetillegg({
        barnetillegg: {
          answers,
        },
        index: activeBarnetilleggIndex,
      })
    );

    resetBarnetilleggForm();
  }
  function onDeleteBarnetillegg() {
    dispatch(deleteBarnetillegg(activeBarnetilleggIndex));
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

function getChildName(barnetillegg: IGeneratorAnswers): string {
  const firstName = barnetillegg.answers.find(
    (answer) => answer.faktumId === "faktum.barn-fornavn-mellomnavn"
  )?.answer as string;
  const lastName = barnetillegg.answers.find(
    (answer) => answer.faktumId === "faktum.barn-etternavn"
  )?.answer as string;

  return `${firstName} ${lastName}`;
}
