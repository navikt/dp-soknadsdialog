import { Label } from "@navikt/ds-react";
import React from "react";
import styles from "./File.module.css";

interface Props {
  filnavn: string;
}

export function File({ filnavn }: Props) {
  return (
    <>
      <div className={styles.file}>
        <Label size="medium">{filnavn}</Label>
        Ferdig opplastet
      </div>
    </>
  );
}
