import React, { useEffect } from "react";
import { Alert, Heading, BodyShort, BodyLong } from "@navikt/ds-react";
import styles from "./_error.module.css";

export default function Error500() {
  useEffect(() => {
    const localStorageErrorsCount = localStorage.getItem("errorsCount");

    if (localStorageErrorsCount) {
      localStorage.removeItem("errorsCount");
    }
  }, []);

  return (
    <Alert variant="error">
      <Heading size={"medium"} className={styles.error}>
        Beklager, det skjedde en teknisk feil.
      </Heading>
      <BodyLong>Vi jobber med å løse den så raskt som mulig. Prøv igjen om litt.</BodyLong>
      <BodyShort>Statuskode 500</BodyShort>
    </Alert>
  );
}
