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
import { Answer, AnswerValue, saveAnswerToQuiz } from "../../store/answers.slice";
import { useDispatch } from "react-redux";
import { FaktumLand } from "./FaktumLand";
import { FaktumEgetGaardsbrukArbeidsaar } from "./faktum-special-cases/FaktumEgetGaardsbrukArbeidsaar";

export interface FaktumProps<P> {
  faktum: P;
  onChange?: (faktum: IFaktum, value: AnswerValue) => void;
  answers?: Answer[];
}

const specialCaseFaktum = ["faktum-eget-gaardsbruk-arbeidsaar"];

export function Faktum(props: FaktumProps<IFaktum>) {
  const dispatch = useDispatch();

  function dispatchAnswer(faktum: IFaktum, answer: AnswerValue) {
    dispatch(
      saveAnswerToQuiz({
        textId: faktum.textId,
        value: answer,
        type: faktum.type,
        id: faktum.id,
      })
    );
  }

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
          <FaktumFlervalg
            faktum={props.faktum}
            answers={props.answers}
            onChange={props.onChange || dispatchAnswer}
          />
        );

      case "tekst":
        return (
          <FaktumText
            faktum={props.faktum}
            answers={props.answers}
            onChange={props.onChange || dispatchAnswer}
          />
        );

      case "double":
      case "int":
        return (
          <FaktumNumber
            faktum={props.faktum}
            answers={props.answers}
            onChange={props.onChange || dispatchAnswer}
          />
        );

      case "generator":
        return <FaktumGenerator faktum={props.faktum} />;

      case "land":
        return (
          <FaktumLand
            faktum={props.faktum}
            answers={props.answers}
            onChange={props.onChange || dispatchAnswer}
          />
        );

      case "localdate":
        return (
          <FaktumDato
            faktum={props.faktum}
            answers={props.answers}
            onChange={props.onChange || dispatchAnswer}
          />
        );

      case "periode":
        return (
          <FaktumPeriode
            faktum={props.faktum}
            answers={props.answers}
            onChange={props.onChange || dispatchAnswer}
          />
        );
    }

    function renderSpecialFaktumType(props: FaktumProps<IFaktum>) {
      switch (props.faktum.textId) {
        case "faktum.eget-gaardsbruk-arbeidsaar":
          return (
            <FaktumEgetGaardsbrukArbeidsaar
              faktum={props.faktum}
              answers={props.answers}
              onChange={props.onChange || dispatchAnswer}
            />
          );
      }
    }
  }

  return <div className={styles.container}>{renderFaktumType()}</div>;
}
