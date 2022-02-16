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

  function saveFaktum(faktumId: string, answer: AnswerType) {
    const answerIndex = generatorAnswers.findIndex((answer) => answer.beskrivendeId === faktumId);

    if (answerIndex === -1) {
      setGeneratorAnswers((state) => [...state, { beskrivendeId: faktumId, answer }]);
    } else {
      const newState = [...generatorAnswers];
      newState[answerIndex] = { beskrivendeId: faktumId, answer };
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
        <div key={faktum.id}>
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
