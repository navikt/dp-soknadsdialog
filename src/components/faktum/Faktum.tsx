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
import { Answer, AnswerType, setAnswer } from "../../store/answers.slice";
import { useDispatch } from "react-redux";

export interface FaktumProps<P> {
  faktum: P;
  onChange?: (faktumId: string, value: AnswerType) => void;
  answers?: Answer[];
}

export function Faktum(props: FaktumProps<IFaktum>) {
  const dispatch = useDispatch();

  const dispatchAnswer = (faktumId: string, answer: AnswerType) => {
    dispatch(setAnswer({ faktumId, answer }));
  };

  const renderFaktumType = () => {
    switch (props.faktum.type) {
      case "boolean":
      case "valg":
        return (
          <FaktumValg
            faktum={props.faktum}
            answers={props.answers}
            onChange={props.onChange || dispatchAnswer}
          />
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
