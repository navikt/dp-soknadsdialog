import React from "react";
import styles from "./Seksjon.module.css";
import { Faktum } from "../faktum/Faktum";
import { ISection } from "../../types/section.types";
import { PortableText } from "@portabletext/react";

export function Seksjon(props: ISection) {
  return (
    <div className={styles.container}>
      <div className={styles.faktum}>
        <h1>{props.title ? props.title : props.id}</h1>
        {props.description && <PortableText value={props.description} />}
        {props.helpText && <p>{props.helpText}</p>}

        {props.faktum.map((faktum) => (
          <Faktum key={faktum?.textId} faktum={faktum} />
        ))}
      </div>
    </div>
  );
}
