import React from "react";
import { Heading } from "@navikt/ds-react";

import styles from "./SoknadHeader.module.css";

export default function SoknadHeader() {
  return (
    <div className={styles.soknadHeader}>
      <Heading size="2xlarge">Søknad om dagpenger</Heading>
    </div>
  );
}
