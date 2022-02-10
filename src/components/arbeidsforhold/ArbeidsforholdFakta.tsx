import { IFaktum } from "../../types/faktum.types";
import { Answer, AnswerType } from "../../store/answers.slice";
import React, { useState } from "react";
import { Faktum } from "../faktum/Faktum";
import { Button } from "@navikt/ds-react";
import styles from "./Arbeidsforhold.module.css";

interface Props {
  fakta: IFaktum[];
  save: (arbeidsforhold: Answer[]) => void;
  cancel: () => void;
}

export function ArbeidsforholdFakta(props: Props) {
  const [arbeidsforholdAnswers, setArbeidsforholdAnswers] = useState<Answer[]>([]);

  function saveFaktum(faktumId: string, answer: AnswerType) {
    const answerIndex = arbeidsforholdAnswers.findIndex((answer) => answer.faktumId === faktumId);

    if (answerIndex === -1) {
      setArbeidsforholdAnswers((state) => [...state, { faktumId, answer }]);
    } else {
      setArbeidsforholdAnswers((state) => [...state, (state[answerIndex] = { faktumId, answer })]);
    }
  }

  function cancel() {
    setArbeidsforholdAnswers([]);
    props.cancel();
  }

  return (
    <>
      {props.fakta.map((faktum) => (
        <div key={faktum.id}>
          <Faktum faktum={faktum} onChange={saveFaktum} />
        </div>
      ))}
      <div className={styles["button-container"]}>
        <Button onClick={() => props.save(arbeidsforholdAnswers)}>Lagre arbreidsforhold</Button>
        <Button onClick={cancel}>Avbryt</Button>
      </div>
    </>
  );
}
