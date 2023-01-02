import React from "react";
import { Heading } from "@navikt/ds-react";
import { HeaderIcon } from "../HeaderIcon";
import { useSanity } from "../../context/sanity-context";
import { SOKNAD_HEADER_TITTEL } from "../../text-constants";
import styles from "./SoknadHeader.module.css";

interface IProps {
  titleTextKey?: string;
}

export function SoknadHeader(props: IProps) {
  const { getAppText } = useSanity();
  return (
    <div className={styles.soknadHeader}>
      <div className={styles.headerContent}>
        <div className={styles.icon}>
          <HeaderIcon />
        </div>
        <Heading size="xlarge" level={"1"} id="header-icon">
          {getAppText(props.titleTextKey ? props.titleTextKey : SOKNAD_HEADER_TITTEL)}
        </Heading>
      </div>
    </div>
  );
}
