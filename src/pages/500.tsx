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
        Vi har tekniske problemer akkurat nå
      </Heading>
      <BodyLong>
        Beklager, vi får ikke kontakt med systemene våre. Svarene dine er lagret og du kan prøve
        igjen om litt.
      </BodyLong>
      <BodyShort className={styles.statusCode}>Statuskode 500</BodyShort>
    </Alert>
  );
}
