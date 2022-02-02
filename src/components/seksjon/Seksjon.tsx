import React from "react";
import styles from "./Seksjon.module.css";
import { Faktum } from "../faktum/Faktum";
import { ISeksjon } from "../../types/seksjon.types";

export function Seksjon(props: ISeksjon) {
  console.log("Seksjon: ", props);
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
    </div>
  );
}
