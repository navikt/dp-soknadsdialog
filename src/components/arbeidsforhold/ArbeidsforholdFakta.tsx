import { IFaktum } from "../../types/faktum.types";
import { Answer, AnswerType } from "../../store/answers.slice";
import React, { useEffect, useState } from "react";
import { Faktum } from "../faktum/Faktum";
import { Button } from "@navikt/ds-react";
import styles from "./Arbeidsforhold.module.css";

interface Props {
  fakta: IFaktum[];
  answers?: Answer[];
  save: (arbeidsforhold: Answer[]) => void;
  cancel: () => void;
}

export function ArbeidsforholdFakta(props: Props) {
  const [arbeidsforholdAnswers, setArbeidsforholdAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    if (props.answers) {
      setArbeidsforholdAnswers(props.answers);
    }
  }, []);

  function saveFaktum(faktumId: string, answer: AnswerType) {
    const answerIndex = arbeidsforholdAnswers.findIndex((answer) => answer.faktumId === faktumId);

    if (answerIndex === -1) {
      setArbeidsforholdAnswers((state) => [...state, { faktumId, answer }]);
    } else {
      const newState = [...arbeidsforholdAnswers];
      newState[answerIndex] = { faktumId, answer };
      setArbeidsforholdAnswers(newState);
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
          <Faktum faktum={faktum} onChange={saveFaktum} answers={arbeidsforholdAnswers} />
        </div>
      ))}
      <div className={styles["button-container"]}>
        <Button onClick={() => props.save(arbeidsforholdAnswers)}>Lagre arbreidsforhold</Button>
        <Button onClick={cancel}>Avbryt</Button>
      </div>
    </>
  );
}
