import React from "react";
import { Heading } from "@navikt/ds-react";
import HeaderIcon from "../../assets/svg/HeaderIcon.svg";

import styles from "./SoknadHeader.module.css";

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
