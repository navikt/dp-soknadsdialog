import React from "react";
import { FaktumValg } from "./FaktumValg";
import { FaktumFlervalg } from "./FaktumFlervalg";
import styles from "./Faktum.module.css";
import {
  QuizFaktum,
  QuizFlervalgFaktum,
  QuizGeneratorFaktum,
  QuizNumberFaktum,
  QuizValgFaktum,
} from "../../types/quiz.types";
import { FaktumText } from "./FaktumText";
import { FaktumNumber } from "./FaktumNumber";
import { FaktumDato } from "./FaktumDato";
import { FaktumPeriode } from "./FaktumPeriode";
import { FaktumEgetGaardsbrukArbeidsaar } from "./faktum-special-cases/FaktumEgetGaardsbrukArbeidsaar";
import { FaktumLand } from "./FaktumLand";
import { FaktumGenerator } from "./FaktumGenerator";

export interface FaktumProps<P> {
  faktum: P;
  onChange?: (faktum: QuizFaktum, value: any) => void;
}

const specialCaseFaktum = ["faktum.eget-gaardsbruk-arbeidsaar-for-timer"];

export function Faktum(props: FaktumProps<QuizFaktum | QuizGeneratorFaktum>) {
  const { faktum } = props;
  function renderFaktumType() {
    if (specialCaseFaktum.includes(faktum.beskrivendeId)) {
      return renderSpecialFaktumType(props);
    }

    switch (faktum.type) {
      case "boolean":
      case "envalg":
        return <FaktumValg faktum={faktum} onChange={props.onChange} />;
      case "flervalg":
        return <FaktumFlervalg faktum={faktum} onChange={props.onChange} />;
      case "tekst":
        return <FaktumText faktum={faktum} onChange={props.onChange} />;

      case "double":
      case "int":
        return <FaktumNumber faktum={faktum} onChange={props.onChange} />;

      case "land":
        return <FaktumLand faktum={faktum} onChange={props.onChange} />;

      case "localdate":
        return <FaktumDato faktum={faktum} onChange={props.onChange} />;

      case "periode":
        return <FaktumPeriode faktum={faktum} onChange={props.onChange} />;

      case "generator":
        return <FaktumGenerator faktum={faktum as QuizGeneratorFaktum} />;
    }

    function renderSpecialFaktumType(props: FaktumProps<QuizFaktum | QuizGeneratorFaktum>) {
      switch (faktum.beskrivendeId) {
        case "faktum.eget-gaardsbruk-arbeidsaar":
          return (
            <FaktumEgetGaardsbrukArbeidsaar
              faktum={faktum as QuizNumberFaktum}
              onChange={props.onChange}
            />
          );
      }
    }
  }

  return (
    <div className={styles.faktum} id={faktum.beskrivendeId}>
      {renderFaktumType()}
    </div>
  );
}
