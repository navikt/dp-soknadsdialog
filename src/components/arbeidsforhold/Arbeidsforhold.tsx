import React, { useState } from "react";
import { IGeneratorFaktum } from "../../types/faktum.types";
import { Accordion, Button } from "@navikt/ds-react";
import { Answer } from "../../store/answers.slice";
import { useDispatch } from "react-redux";
import { GeneratorFakta } from "../generator-fakta/GeneratorFakta";
import styles from "./Arbeidsforhold.module.css";
import { deleteGeneratorFromQuiz, saveGeneratorStateToQuiz } from "../../store/generators.slice";
import { FAKTUM_ARBEIDSFORHOLD } from "../../constants";
import { useGeneratorStateAnswers } from "../../hooks/useGeneratorStateAnswers";

export function Arbeidsforhold(props: IGeneratorFaktum) {
  const dispatch = useDispatch();
  const arbeidsforhold = useGeneratorStateAnswers(FAKTUM_ARBEIDSFORHOLD);
  const [addNewArbeidsforhold, setNewArbeidsforhold] = useState(false);
  const [activeArbeidsforholdIndex, setActiveArbeidsforholdIndex] = useState<number | undefined>(0);

  function onSaveArbeidsforhold(answers: Answer[]) {
    if (activeArbeidsforholdIndex === undefined) {
      // TODO sentry
      // eslint-disable-next-line no-console
      console.error("prøver å lagre arbeidsforhold uten av active index er satt");
      return;
    }

    dispatch(
      saveGeneratorStateToQuiz({
        index: activeArbeidsforholdIndex,
        beskrivendeId: FAKTUM_ARBEIDSFORHOLD,
        answers,
      })
    );
    resetArbeidsforholdForm();
  }

  function onDeleteArbeidsforhold() {
    if (activeArbeidsforholdIndex === undefined) {
      // TODO sentry
      // eslint-disable-next-line no-console
      console.error("prøver å lagre arbeidsforhold uten av active index er satt");
      return;
    }
    dispatch(
      deleteGeneratorFromQuiz({
        index: activeArbeidsforholdIndex,
        beskrivendeId: FAKTUM_ARBEIDSFORHOLD,
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
        {arbeidsforhold.map((answers, index) => (
          <Accordion.Item key={index} open={index === activeArbeidsforholdIndex}>
            <Accordion.Header onClick={() => toggleActiveArbeidsforhold(index)}>
              {getArbeidsforholdName(answers)}
            </Accordion.Header>

            <Accordion.Content>
              <Button onClick={() => onDeleteArbeidsforhold()}>Slett arbeidsforhold</Button>
              <GeneratorFakta
                answers={answers}
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

function getArbeidsforholdName(arbeidsforhold: Answer[]): string {
  return (
    (arbeidsforhold.find((answer) => answer.beskrivendeId === "faktum.navn-bedrift")
      ?.value as string) ?? "Fant ikke navn på arbeidsgiver"
  );
}
