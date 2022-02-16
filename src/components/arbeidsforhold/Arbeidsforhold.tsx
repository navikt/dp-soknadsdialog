import React, { useState } from "react";
import { IGeneratorFaktum } from "../../types/faktum.types";
import { Accordion, Button } from "@navikt/ds-react";
import {
  deleteArbeidsforhold,
  IGeneratorAnswer,
  saveArbeidsforhold,
} from "../../store/arbeidsforhold.slice";
import { Answer } from "../../store/answers.slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { GeneratorFakta } from "../generator-fakta/GeneratorFakta";
import styles from "./Arbeidsforhold.module.css";

export function Arbeidsforhold(props: IGeneratorFaktum) {
  const dispatch = useDispatch();
  const arbeidsforhold = useSelector((state: RootState) => state.arbeidsforhold.answers);
  const [addNewArbeidsforhold, setNewArbeidsforhold] = useState(false);
  const [activeArbeidsforholdIndex, setActiveArbeidsforholdIndex] = useState<number | undefined>(0);

  function onSaveArbeidsforhold(answers: Answer[]) {
    dispatch(
      saveArbeidsforhold({
        arbeidsforhold: {
          answers,
        },
        index: activeArbeidsforholdIndex,
      })
    );

    resetArbeidsforholdForm();
  }
  function onDeleteArbeidsforhold() {
    dispatch(deleteArbeidsforhold(activeArbeidsforholdIndex));
    resetArbeidsforholdForm();
  }

  function onAddArbeidsforhold() {
    if (arbeidsforhold.length > 0) {
      setActiveArbeidsforholdIndex(() => arbeidsforhold.length);
    }
    setNewArbeidsforhold(!addNewArbeidsforhold);
  }

  function toggleActiveArbeidsforhold(index: number) {
    setNewArbeidsforhold(false);

    if (index === activeArbeidsforholdIndex) {
      setActiveArbeidsforholdIndex(undefined);
    } else {
      setActiveArbeidsforholdIndex(index);
    }
  }

  function resetArbeidsforholdForm() {
    setNewArbeidsforhold(false);
    setActiveArbeidsforholdIndex(undefined);
  }

  return (
    <div>
      <Accordion>
        {arbeidsforhold.map((arbeidsforhold, index) => (
          <Accordion.Item key={index} open={index === activeArbeidsforholdIndex}>
            <Accordion.Header onClick={() => toggleActiveArbeidsforhold(index)}>
              {getArbeidsforholdName(arbeidsforhold)}
            </Accordion.Header>

            <Accordion.Content>
              <Button onClick={() => onDeleteArbeidsforhold()}>Slett arbeidsforhold</Button>
              <GeneratorFakta
                answers={arbeidsforhold.answers}
                fakta={props.faktum}
                save={onSaveArbeidsforhold}
                cancel={resetArbeidsforholdForm}
              />
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>

      {!addNewArbeidsforhold && (
        <Button className={styles["button-container"]} onClick={onAddArbeidsforhold}>
          Legg til arbreidsforhold
        </Button>
      )}

      {addNewArbeidsforhold && (
        <GeneratorFakta
          fakta={props.faktum}
          save={onSaveArbeidsforhold}
          cancel={resetArbeidsforholdForm}
        />
      )}
    </div>
  );
}

function getArbeidsforholdName(arbeidsforhold: IGeneratorAnswer): string {
  return (
    (arbeidsforhold.answers.find((answer) => answer.beskrivendeId === "faktum.navn-bedrift")
      ?.answer as string) ?? "Fant ikke navn på arbeidsgiver"
  );
}
