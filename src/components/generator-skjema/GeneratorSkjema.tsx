import React, { useState } from "react";
import { Button } from "@navikt/ds-react";
import styles from "../arbeidsforhold/Arbeidsforhold.module.css";
import { QuizFaktum, QuizFaktumSvarType } from "../../types/quiz.types";
import { Faktum } from "../faktum/Faktum";

interface Props {
  templates: Omit<QuizFaktum, "svar" | "readOnly">[];
  svar: QuizFaktum[];
  save: (svar: QuizFaktum[]) => void;
  cancel: () => void;
}

export function GeneratorSkjema(props: Props) {
  const [generatorSvar, setGeneratorSvar] = useState<QuizFaktum[]>(props.svar);

  function saveFaktum(faktum: QuizFaktum, value: QuizFaktumSvarType) {
    const answerIndex = generatorSvar.findIndex(
      (svar) => svar.beskrivendeId === faktum.beskrivendeId
    );

    // TODO typescript
    // @ts-ignore
    const newAnswer: QuizFaktum = {
      ...faktum,
      svar: value,
    };

    if (answerIndex === -1) {
      setGeneratorSvar((state) => [...state, newAnswer]);
    } else {
      const newState = [...generatorSvar];
      newState[answerIndex] = newAnswer;
      setGeneratorSvar(newState);
    }
  }

  function cancel() {
    setGeneratorSvar([]);
    props.cancel();
  }

  return (
    <>
      {props.templates.map((faktum) => {
        const faktumWithSvar = generatorSvar.find(
          (svar) => svar.beskrivendeId === faktum.beskrivendeId
        );
        return (
          <div key={faktum.beskrivendeId}>
            <Faktum faktum={faktumWithSvar || (faktum as QuizFaktum)} onChange={saveFaktum} />
          </div>
        );
      })}
      <div className={styles["button-container"]}>
        <Button onClick={() => props.save(generatorSvar)}>Lagre svar</Button>
        <Button onClick={cancel}>Avbryt</Button>
      </div>
    </>
  );
}
