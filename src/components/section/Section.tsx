import React from "react";
import { Faktum } from "../faktum/Faktum";
import { QuizSeksjon } from "../../types/quiz.types";
import styles from "./Section.module.css";

interface Props {
  section: QuizSeksjon;
  firstUnansweredFaktumIndex: number;
}

export function Section(props: Props) {
  return (
    <div>
      <div className={styles.faktum}>
        {props.section?.beskrivendeId}
        {props.section?.fakta?.map((faktum, index) => {
          if (index <= props.firstUnansweredFaktumIndex) {
            return <Faktum key={faktum.beskrivendeId} faktum={faktum} />;
          }
        })}
      </div>
    </div>
  );
}
