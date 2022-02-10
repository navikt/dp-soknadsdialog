import React, { useState } from "react";
import { IGeneratorFaktum } from "../../types/faktum.types";
import { Accordion, Button } from "@navikt/ds-react";
import { IArbeidsforhold, saveArbeidsforhold } from "../../store/arbeidsforhold.slice";
import { Answer } from "../../store/answers.slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { ArbeidsforholdFakta } from "./ArbeidsforholdFakta";
import styles from "./Arbeidsforhold.module.css";

export function Arbeidsforhold(props: IGeneratorFaktum) {
  const dispatch = useDispatch();
  const arbeidsforhold = useSelector((state: RootState) => state.arbeidsforhold);
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

  function onAddArbeidsforhold() {
    if (arbeidsforhold.length > 0) {
      setActiveArbeidsforholdIndex(() => arbeidsforhold.length);
    }
    setNewArbeidsforhold(!addNewArbeidsforhold);
  }

  function toggleActiveArebidsforhold(index: number) {
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
            <Accordion.Header onClick={() => toggleActiveArebidsforhold(index)}>
              {getArbeidsforholdName(arbeidsforhold)}
            </Accordion.Header>
            <Accordion.Content>
              <ArbeidsforholdFakta
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
        <ArbeidsforholdFakta
          fakta={props.faktum}
          save={onSaveArbeidsforhold}
          cancel={resetArbeidsforholdForm}
        />
      )}
    </div>
  );
}

function getArbeidsforholdName(arbeidsforhold: IArbeidsforhold): string {
  return (
    (arbeidsforhold.answers.find((answer) => answer.faktumId === "faktum.navn-bedrift")
      ?.answer as string) ?? "Fant ikke navn på arbeidsgiver"
  );
}
