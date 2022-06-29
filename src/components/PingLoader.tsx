import React from "react";
import styles from "./PingLoader.module.css";
import { Label, Loader } from "@navikt/ds-react";
import { useSanity } from "../context/sanity-context";

export function PingLoader() {
  const { getAppTekst } = useSanity();

  return (
    <div className={styles.pingLoader}>
      <Loader size="large" title="venter..." variant="interaction" />
      <div className={styles.loadingText}>
        <Label>{getAppTekst("laster-sporsmal.tittel")}</Label>
        <span>{getAppTekst("laster-sporsmal.tekst")}</span>
      </div>
    </div>
  );
}
