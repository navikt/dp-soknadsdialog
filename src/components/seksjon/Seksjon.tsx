import React from "react";
import styles from "./Seksjon.module.css";
import { Faktum } from "../faktum/Faktum";
import { ISeksjon } from "../../types/seksjon.types";
import { BodyLong, BodyShort, Heading } from "@navikt/ds-react";

export function Seksjon(props: ISeksjon) {
  return (
    <div className={styles.seksjon}>
      <Heading size="large" level="1" className={styles.seksjonHeading}>
        {props.title ? props.title : props.id}
      </Heading>
      <BodyLong>{props.description && <p>{props.description}</p>}</BodyLong>
      <BodyShort>{props.helpText && <p>{props.helpText}</p>}</BodyShort>

      {props.faktum.map((faktum) => (
        <Faktum key={faktum.id} {...faktum} />
      ))}
    </div>
  );
}
