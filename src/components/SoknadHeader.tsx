import React from "react";
import { Heading } from "@navikt/ds-react";

import styles from "./SoknadHeader.module.css";
import { HeaderIcon } from "./HeaderIcon";

export default function SoknadHeader() {
  return (
    <div className={styles.soknadHeader}>
      <div className={styles.headerContent}>
        <div className={styles.icon}>
          <HeaderIcon />
        </div>
        <Heading size="2xlarge">Søknad om dagpenger</Heading>
      </div>
    </div>
  );
}
