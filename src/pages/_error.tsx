import React from "react";
import { NextPageContext } from "next";
import { Alert, Heading, BodyShort, BodyLong } from "@navikt/ds-react";
import styles from "./_error.module.css";

interface IProps {
  title: string;
  details: string;
  statusCode?: number;
  developerErrorMessage?: string;
}

export default function Error(props: IProps) {
  const { statusCode, title, details, developerErrorMessage } = props;

  return (
    <Alert variant="error">
      <Heading size={"medium"} className={styles.error}>
        {title}
      </Heading>
      <BodyLong>{details}</BodyLong>
      {statusCode && <BodyShort className={styles.statusCode}>Statuskode {statusCode}</BodyShort>}
      {process.env.NEXT_PUBLIC_LOCALHOST && (
        <BodyShort className={styles.developerErrorMessage}>{developerErrorMessage}</BodyShort>
      )}
    </Alert>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
