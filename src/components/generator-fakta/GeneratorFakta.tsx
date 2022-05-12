import { Answer } from "../../store/generator-utils";
import React, { useEffect, useState } from "react";
import { Button } from "@navikt/ds-react";
import styles from "../arbeidsforhold/Arbeidsforhold.module.css";
import { QuizFaktum } from "../../types/quiz.types";

interface Props {
  fakta: Omit<QuizFaktum, "svar">[];
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

  // function saveFaktum(faktum: QuizFaktum, value: AnswerValue) {
  //   const answerIndex = generatorAnswers.findIndex(
  //     (answer) => answer.textId === faktum.beskrivendeId
  //   );
  //
  //   const newAnswer = {
  //     id: faktum.id,
  //     textId: faktum.beskrivendeId,
  //     type: faktum.type,
  //     value,
  //   };
  //
  //   if (answerIndex === -1) {
  //     setGeneratorAnswers((state) => [...state, newAnswer]);
  //   } else {
  //     const newState = [...generatorAnswers];
  //     newState[answerIndex] = newAnswer;
  //     setGeneratorAnswers(newState);
  //   }
  // }

  function cancel() {
    setGeneratorAnswers([]);
    props.cancel();
  }

  return (
    <>
      {props.fakta.map((faktum) => (
        <div key={faktum.beskrivendeId}>
          {/*<Faktum faktum={faktum} onChange={saveFaktum} answers={generatorAnswers} />*/}
        </div>
      ))}
      <div className={styles["button-container"]}>
        <Button onClick={() => props.save(generatorAnswers)}>Lagre svar</Button>
        <Button onClick={cancel}>Avbryt</Button>
      </div>
    </>
  );
}
