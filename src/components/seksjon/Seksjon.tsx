import React from "react";
import styles from "./Seksjon.module.css";
import { TextKeyValuePair } from "../../sanity/types";
import { Faktum, IFaktum } from "../faktum/Faktum";

export interface ISeksjon {
  _id: string;
  title: TextKeyValuePair;
  description?: TextKeyValuePair;
  helpText?: TextKeyValuePair;
  faktum: IFaktum[];
}

export function Seksjon(props: ISeksjon) {
  console.log(props);
  return (
    <div className={styles.container}>
      <div className={styles.faktum}>
        {props.title && <h1>{props.title.value}</h1>}
        {props.description && <p>{props.description.value}</p>}
        {props.helpText && <pre>{props.helpText.value}</pre>}

        {props.faktum.map((faktum) => (
          <Faktum key={faktum._id} {...faktum} />
        ))}
      </div>
      <div className={styles.timeline}>Timeline step-indikator</div>
    </div>
  );
}
