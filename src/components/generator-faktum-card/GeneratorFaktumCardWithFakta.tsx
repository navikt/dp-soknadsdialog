import React, { PropsWithChildren } from "react";
import { Faktum } from "../faktum/Faktum";
import { QuizFaktum } from "../../types/quiz.types";
import styles from "./GeneratorFaktumCard.module.css";

interface IProps {
  fakta: QuizFaktum[];
}

export function GeneratorFaktumCardWithFakta(props: PropsWithChildren<IProps>) {
  return (
    <div className={styles.card}>
      {props.children}

      <div className={styles.fakta}>
        {props.fakta.map(
          (faktum) => !faktum.readOnly && <Faktum key={faktum.id} faktum={faktum} />
        )}
      </div>
    </div>
  );
}
