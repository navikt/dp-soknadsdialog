import { Alert, Heading } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import classNames from "classnames";
import React from "react";
import { ISanityAlertText } from "../types/sanity.types";
import styles from "./AlertText.module.css";

interface IProps {
  alertText: ISanityAlertText;
  spacingTop?: boolean;
  spacingBottom?: boolean;
}

export function AlertText(props: IProps) {
  const { type, title, body } = props.alertText;

  return (
    <div
      className={classNames(styles.alertText, {
        [styles.spacingTop]: props.spacingTop,
        [styles.spacingBottom]: props.spacingBottom,
      })}
    >
      <Alert variant={type}>
        {title && (
          <Heading size={"small"} className={styles.alertTextHeading}>
            {title}
          </Heading>
        )}
        {body && <PortableText value={body} />}
      </Alert>
    </div>
  );
}
