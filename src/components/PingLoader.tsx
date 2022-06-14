import React from "react";
import styles from "./PingLoader.module.css";
import { Label, Loader } from "@navikt/ds-react";

export function PingLoader() {
  return (
    <div className={styles.pingLoader}>
      <Loader size="large" title="venter..." variant="interaction" />
      <div className={styles.loadingText}>
        <Label>Henter neste spørsmål</Label>
        <span>Tenk på noe som gjør deg glad.</span>
      </div>
    </div>
  );
}
