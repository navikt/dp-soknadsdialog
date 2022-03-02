import React from "react";
import { IFaktum } from "../../types/faktum.types";
import { FaktumValg } from "./FaktumValg";
import { FaktumFlervalg } from "./FaktumFlervalg";
import { FaktumText } from "./FaktumText";
import { FaktumNumber } from "./FaktumNumber";
import { FaktumGenerator } from "./FaktumGenerator";
import { FaktumDropdown } from "./FaktumDropdown";
import { FaktumDato } from "./FaktumDato";
import { FaktumPeriode } from "./FaktumPeriode";
import styles from "./Faktum.module.css";
import { Answer, AnswerType, saveAnswerToQuiz } from "../../store/answers.slice";
import { useDispatch } from "react-redux";
import { FaktumLand } from "./FaktumLand";

export interface FaktumProps<P> {
  faktum: P;
  onChange?: (faktum: IFaktum, value: AnswerType) => void;
  answers?: Answer[];
}

export function Faktum(props: FaktumProps<IFaktum>) {
  const dispatch = useDispatch();

  const dispatchAnswer = (faktum: IFaktum, answer: AnswerType) => {
    dispatch(
      saveAnswerToQuiz({
        beskrivendeId: faktum.beskrivendeId,
        answer,
        type: faktum.type,
        id: faktum.id,
      })
    );
  };

  const renderFaktumType = () => {
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
      case "dropdown":
        return (
          <FaktumDropdown
            faktum={props.faktum}
            answers={props.answers}
            onChange={props.onChange || dispatchAnswer}
          />
        );
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
  };
  return <div className={styles.container}>{renderFaktumType()}</div>;
}
