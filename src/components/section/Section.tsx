import React from "react";
import { Faktum } from "../faktum/Faktum";
import { QuizSeksjon } from "../../types/quiz.types";
import styles from "./Section.module.css";
import { useSanity } from "../../context/sanity-context";
import { SectionHeading } from "./SectionHeading";

interface Props {
  section: QuizSeksjon;
  firstUnansweredFaktumIndex: number;
}

export function Section(props: Props) {
  const { getSeksjonTextById } = useSanity();
  const sectionTexts = getSeksjonTextById(props.section.beskrivendeId);

  return (
    <div className={styles.faktum}>
      <SectionHeading text={sectionTexts} fallback={props.section.beskrivendeId} />

      {props.section?.fakta?.map((faktum, index) => {
        if (index <= props.firstUnansweredFaktumIndex) {
          return <Faktum key={faktum.beskrivendeId} faktum={faktum} />;
        }
      })}
    </div>
  );
}
