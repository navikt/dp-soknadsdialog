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
import { AnswerType, setAnswer } from "../../store/answers.slice";
import { useDispatch } from "react-redux";

export interface FaktumProps<P> {
  faktum: P;
  onChange: (faktumId: string, value: AnswerType) => void;
}

export function Faktum(faktum: IFaktum) {
  const dispatch = useDispatch();

  const dispatchAnswer = (faktumId: string, answer: AnswerType) => {
    dispatch(setAnswer({ faktumId, answer }));
  };

  const renderFaktumType = () => {
    switch (faktum.type) {
      case "boolean":
      case "valg":
        return <FaktumValg faktum={faktum} onChange={dispatchAnswer} />;
      case "flervalg":
        return <FaktumFlervalg faktum={faktum} onChange={dispatchAnswer} />;
      case "tekst":
        return <FaktumText faktum={faktum} onChange={dispatchAnswer} />;
      case "double":
      case "int":
        return <FaktumNumber faktum={faktum} onChange={dispatchAnswer} />;
      case "generator":
        return <FaktumGenerator faktum={faktum} />;
      case "dropdown":
        return <FaktumDropdown faktum={faktum} onChange={dispatchAnswer} />;
      case "localdate":
        return <FaktumDato faktum={faktum} onChange={dispatchAnswer} />;
      case "periode":
        return <FaktumPeriode faktum={faktum} onChange={dispatchAnswer} />;
    }
  };
  return <div className={styles.container}>{renderFaktumType()}</div>;
}
