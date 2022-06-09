import React from "react";
import styles from "./PingLoader.module.css";
import { Loader } from "@navikt/ds-react";

export function PingLoader() {
  return (
    <div className={styles.pingLoader}>
      <Loader size="large" title="venter..." variant="interaction" />
      <div className={styles.loadingText}>
        <span className={styles.heading}>Henter neste spørsmål</span>
        <span>Tenk på noe som gjør deg glad.</span>
      </div>
    </div>
  );
}
