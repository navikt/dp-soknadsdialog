import { Alert, Heading } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import React from "react";
import { SanityAlertText } from "../types/sanity.types";
import styles from "./AlertText.module.css";

interface Props {
  alertText: SanityAlertText;
}

export function AlertText(props: Props) {
  const { type, title, body } = props.alertText;

  return (
    <div className={styles.alertText}>
      <Alert variant={type}>
        {title && <Heading size={"small"}>{title} </Heading>}
        <PortableText value={body} />
      </Alert>
    </div>
  );
}
