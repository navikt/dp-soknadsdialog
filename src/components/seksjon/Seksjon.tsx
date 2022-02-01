import React from "react";
import styles from "./Seksjon.module.css";
import { Faktum, IFaktum } from "../faktum/Faktum";

export interface ISeksjon {
  _id: string;
  title: string;
  description?: string;
  helpText?: string;
  faktum: IFaktum[];
}

export function Seksjon(props: ISeksjon) {
  console.log(props);
  return (
    <div className={styles.container}>
      <div className={styles.faktum}>
        {props.title && <h1>{props.title}</h1>}
        {props.description && <p>{props.description}</p>}
        {props.helpText && <p>{props.helpText}</p>}

        {props.faktum.map((faktum) => (
          <Faktum key={faktum.id} {...faktum} />
        ))}
      </div>
      <div className={styles.timeline}>Timeline step-indikator</div>
    </div>
  );
}
