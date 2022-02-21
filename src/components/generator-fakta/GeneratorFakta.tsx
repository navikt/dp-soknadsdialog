import { IFaktum } from "../../types/faktum.types";
import { Answer, AnswerType } from "../../store/answers.slice";
import React, { useEffect, useState } from "react";
import { Faktum } from "../faktum/Faktum";
import { Button } from "@navikt/ds-react";
import styles from "../arbeidsforhold/Arbeidsforhold.module.css";

interface Props {
  fakta: IFaktum[];
  answers?: Answer[];
  save: (answers: Answer[]) => void;
  cancel: () => void;
}

export function GeneratorFakta(props: Props) {
  const [generatorAnswers, setGeneratorAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    if (props.answers) {
      setGeneratorAnswers(props.answers);
    }
  }, []);

  function saveFaktum(faktum: IFaktum, answer: AnswerType) {
    const answerIndex = generatorAnswers.findIndex(
      (answer) => answer.beskrivendeId === faktum.beskrivendeId
    );

    const newAnswer = {
      id: faktum.id,
      beskrivendeId: faktum.beskrivendeId,
      type: faktum.type,
      answer,
    };

    if (answerIndex === -1) {
      setGeneratorAnswers((state) => [...state, newAnswer]);
    } else {
      const newState = [...generatorAnswers];
      newState[answerIndex] = newAnswer;
      setGeneratorAnswers(newState);
    }
  }

  function cancel() {
    setGeneratorAnswers([]);
    props.cancel();
  }

  return (
    <>
      {props.fakta.map((faktum) => (
        <div key={faktum.beskrivendeId}>
          <Faktum faktum={faktum} onChange={saveFaktum} answers={generatorAnswers} />
        </div>
      ))}
      <div className={styles["button-container"]}>
        <Button onClick={() => props.save(generatorAnswers)}>Lagre arbreidsforhold</Button>
        <Button onClick={cancel}>Avbryt</Button>
      </div>
    </>
  );
}
