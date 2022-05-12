import React from "react";
import { Faktum } from "../faktum/Faktum";
import { QuizSeksjon } from "../../types/quiz.types";
import styles from "./Section.module.css";

interface Props {
  section: QuizSeksjon;
  navigateNextSection: () => void;
  navigatePreviousSection: () => void;
}

export function Section(props: Props) {
  const sectionFaktumIndex = 999;

  return (
    <div>
      <div className={styles.rootFaktum}>
        {props.section?.beskrivendeId}
        {props.section?.fakta?.map((faktum, index) => {
          if (index <= sectionFaktumIndex) {
            return <Faktum key={faktum.beskrivendeId} faktum={faktum} />;
          }
        })}
      </div>
    </div>
  );
}
