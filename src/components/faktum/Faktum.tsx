import React from "react";
import { FaktumValg } from "./FaktumValg";
import { FaktumFlervalg } from "./FaktumFlervalg";
import styles from "./Faktum.module.css";
import { AnswerValue } from "../../store/answers.slice";
import { QuizFaktum } from "../../types/quiz.types";
import { FaktumText } from "./FaktumText";

export interface FaktumProps<P> {
  faktum: P;
  onChange?: (faktum: QuizFaktum, value: AnswerValue) => void;
}

const specialCaseFaktum = ["faktum.eget-gaardsbruk-arbeidsaar-for-timer"];

export function Faktum(props: FaktumProps<QuizFaktum>) {
  function renderFaktumType() {
    // if (specialCaseFaktum.includes(props.faktum.textId)) {
    //   return renderSpecialFaktumType(props);
    // }

    switch (props.faktum.type) {
      case "boolean":
      case "envalg":
        // @ts-ignore
        return <FaktumValg faktum={props.faktum} onChange={props.onChange} />;
      case "flervalg":
        // @ts-ignore
        return <FaktumFlervalg faktum={props.faktum} onChange={props.onChange} />;
      case "tekst":
        return <FaktumText faktum={props.faktum} onChange={props.onChange} />;
      //
      //   case "double":
      //   case "int":
      //     return (
      //       <FaktumNumber faktum={props.faktum} answers={props.answers} onChange={props.onChange} />
      //     );
      //
      //   case "generator":
      //     return <FaktumGenerator faktum={props.faktum} />;
      //
      //   case "land":
      //     return (
      //       <FaktumLand faktum={props.faktum} answers={props.answers} onChange={props.onChange} />
      //     );
      //
      //   case "localdate":
      //     return (
      //       <FaktumDato faktum={props.faktum} answers={props.answers} onChange={props.onChange} />
      //     );
      //
      //   case "periode":
      //     return (
      //       <FaktumPeriode faktum={props.faktum} answers={props.answers} onChange={props.onChange} />
      //     );
      // }
      //
      // function renderSpecialFaktumType(props: FaktumProps<IFaktum>) {
      //   switch (props.faktum.textId) {
      //     case "faktum.eget-gaardsbruk-arbeidsaar":
      //       return (
      //         <FaktumEgetGaardsbrukArbeidsaar
      //           faktum={props.faktum}
      //           answers={props.answers}
      //           onChange={props.onChange}
      //         />
      //       );
      //   }
    }
  }

  return (
    <div className={styles.faktum} id={props.faktum.beskrivendeId}>
      {renderFaktumType()}
    </div>
  );
}
