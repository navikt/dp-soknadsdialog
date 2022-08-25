import React, { useEffect } from "react";
import { NextPageContext } from "next";
import { Alert, Heading, BodyShort, BodyLong } from "@navikt/ds-react";
import styles from "./_error.module.css";

interface IProps {
  title: string;
  details: string;
  statusCode?: number;
}

export default function Error(props: IProps) {
  const { statusCode, title, details } = props;

  useEffect(() => {
    if (statusCode === 404) {
      window.location.href = "http://www.nav.no/404";
    }
  }, []);

  if (statusCode === 404) {
    return (
      <Alert variant="info">
        <Heading size={"medium"} className={styles.error}>
          Fant ikke siden
        </Heading>
        <BodyLong>
          Beklager, siden kan være slettet eller flyttet, eller det var en feil i lenken som førte
          deg hit.
        </BodyLong>
        {statusCode && <BodyShort className={styles.statusCode}>Statuskode {statusCode}</BodyShort>}
      </Alert>
    );
  }

  return (
    <Alert variant="error">
      <Heading size={"medium"} className={styles.error}>
        {title}
      </Heading>
      <BodyLong>{details}</BodyLong>
      {statusCode && <BodyShort className={styles.statusCode}>Statuskode {statusCode}</BodyShort>}
    </Alert>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
