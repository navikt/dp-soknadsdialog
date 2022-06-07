import React from "react";
import styles from "./PingLoader.module.css";
import { Loader } from "@navikt/ds-react";

export function PingLoader() {
  return (
    <div className={styles.pingLoader}>
      <Loader
        className={styles.icon}
        size="large"
        title="venter..."
        transparent={true}
        variant="interaction"
      />
      <div className={styles.loadingText}>
        <span className={styles.heading}>Henter neste spørsmål</span>
        <p className={styles.description}>Tenk på noe som gjør deg glad.</p>
      </div>
    </div>
  );
}
