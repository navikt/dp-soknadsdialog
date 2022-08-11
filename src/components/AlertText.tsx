import { Alert, Heading } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import classNames from "classnames";
import React from "react";
import { SanityAlertText } from "../types/sanity.types";
import styles from "./AlertText.module.css";

interface Props {
  alertText: SanityAlertText;
  spacingTop?: boolean;
}

export function AlertText(props: Props) {
  const { type, title, body } = props.alertText;

  return (
    <div className={classNames(styles.alertText, { [styles.spacingTop]: props.spacingTop })}>
      <Alert variant={type}>
        {title && (
          <Heading size={"small"} className={styles.alertTextHeading}>
            {title}
          </Heading>
        )}
        <PortableText value={body} />
      </Alert>
    </div>
  );
}
