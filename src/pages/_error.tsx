import React from "react";
import { NextPageContext } from "next";
import { Alert, Heading, BodyShort, BodyLong } from "@navikt/ds-react";
import styles from "./_error.module.css";

interface IProps {
  statusCode?: number;
  title: string;
  details?: string;
}
export default function Error(props: IProps) {
  const { statusCode, title, details } = props;

  return (
    <Alert variant="error">
      <Heading size={"medium"} className={styles.error}>
        {title}
      </Heading>
      <BodyLong>{details}</BodyLong>
      {statusCode && <BodyShort>Statuskode {statusCode}</BodyShort>}
    </Alert>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
