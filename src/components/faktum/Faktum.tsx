import React from "react";
import { IFaktum } from "../../types/faktum.types";
import { FaktumValg } from "./FaktumValg";
import { FaktumFlervalg } from "./FaktumFlervalg";
import { FaktumText } from "./FaktumText";
import { FaktumNumber } from "./FaktumNumber";
import { FaktumGenerator } from "./FaktumGenerator";
import { FaktumDato } from "./FaktumDato";
import { FaktumPeriode } from "./FaktumPeriode";
import styles from "./Faktum.module.css";
import { Answer, AnswerValue } from "../../store/answers.slice";
import { FaktumLand } from "./FaktumLand";
import { FaktumEgetGaardsbrukArbeidsaar } from "./faktum-special-cases/FaktumEgetGaardsbrukArbeidsaar";

export interface FaktumProps<P> {
  faktum: P;
  onChange?: (faktum: IFaktum, value: AnswerValue) => void;
  answers?: Answer[];
}

const specialCaseFaktum = ["faktum-eget-gaardsbruk-arbeidsaar"];

export function Faktum(props: FaktumProps<IFaktum>) {
  function renderFaktumType() {
    if (specialCaseFaktum.includes(props.faktum.textId)) {
      return renderSpecialFaktumType(props);
    }

    switch (props.faktum.type) {
      case "boolean":
      case "envalg":
        return (
          <FaktumValg faktum={props.faktum} answers={props.answers} onChange={props.onChange} />
        );

      case "flervalg":
        return (
          <FaktumFlervalg faktum={props.faktum} answers={props.answers} onChange={props.onChange} />
        );

      case "tekst":
        return (
          <FaktumText faktum={props.faktum} answers={props.answers} onChange={props.onChange} />
        );

      case "double":
      case "int":
        return (
          <FaktumNumber faktum={props.faktum} answers={props.answers} onChange={props.onChange} />
        );

      case "generator":
        return <FaktumGenerator faktum={props.faktum} />;

      case "land":
        return (
          <FaktumLand faktum={props.faktum} answers={props.answers} onChange={props.onChange} />
        );

      case "localdate":
        return (
          <FaktumDato faktum={props.faktum} answers={props.answers} onChange={props.onChange} />
        );

      case "periode":
        return (
          <FaktumPeriode faktum={props.faktum} answers={props.answers} onChange={props.onChange} />
        );
    }

    function renderSpecialFaktumType(props: FaktumProps<IFaktum>) {
      switch (props.faktum.textId) {
        case "faktum.eget-gaardsbruk-arbeidsaar":
          return (
            <FaktumEgetGaardsbrukArbeidsaar
              faktum={props.faktum}
              answers={props.answers}
              onChange={props.onChange}
            />
          );
      }
    }
  }

  return <div className={styles.container}>{renderFaktumType()}</div>;
}
