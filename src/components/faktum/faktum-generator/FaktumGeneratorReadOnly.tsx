import React from "react";
import { IQuizGeneratorFaktum } from "../../../types/quiz.types";
import { Faktum, IFaktumReadOnly } from "../Faktum";
import styles from "./FaktumGenerator.module.css";

export function FaktumGeneratorReadOnly(props: IFaktumReadOnly<IQuizGeneratorFaktum>) {
  const { faktum, showAllFaktumTexts } = props;
  return (
    <>
      {faktum?.svar?.map((fakta, index) => (
        <div className={styles.generatorReadOnlyCard} key={index}>
          {fakta.map((f) => (
            <Faktum
              key={faktum.beskrivendeId}
              faktum={f}
              readonly={true}
              showAllFaktumTexts={showAllFaktumTexts}
            />
          ))}
        </div>
      ))}
    </>
  );
}
