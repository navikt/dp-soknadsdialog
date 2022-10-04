import React, { BodyLong, Heading, Button, Modal } from "@navikt/ds-react";
import classNames from "classnames";
import { NextPageContext } from "next";
import { TechnicalError } from "../svg-icons/TechnicalError";
import { useEffect } from "react";
import styles from "./_error.module.css";

interface IProps {
  title: string;
  details: string;
  statusCode?: number;
}

export default function ErrorPage(props: IProps) {
  const { statusCode, title, details } = props;

  useEffect(() => {
    if (Modal.setAppElement) {
      Modal.setAppElement("#__next");
    }
  }, []);

  if (statusCode === 404) {
    return (
      <div className={styles.notFoundPageContainer}>
        <Heading level="1" size="large">
          Fant ikke siden, Statuskode 404
        </Heading>
        <BodyLong className={styles.pageNotFoundDescription}>
          Beklager, siden kan være slettet eller flyttet, eller det var en feil i lenken som førte
          deg hit.
        </BodyLong>
        <Button variant="primary" size="medium" onClick={() => gotoDittNav()}>
          Gå til Ditt NAV
        </Button>
        {props.details}
      </div>
    );
  }

  function gotoDittNav() {
    window.location.assign("https://www.nav.no/no/ditt-nav");
  }

  return (
    <Modal
      className={classNames("modal-container", [styles.error])}
      onClose={() => {
        return;
      }}
      open={true}
      closeButton={false}
      shouldCloseOnOverlayClick={false}
    >
      <Modal.Content>
        <div className={styles.errorIconContainer}>
          <TechnicalError />
        </div>
        <Heading size={"medium"} spacing>
          {title}
        </Heading>
        <BodyLong>{details}</BodyLong>
        <div className={styles.errorButtonContainer}>
          <Button variant="primary" size="medium" onClick={() => gotoDittNav()}>
            Gå til Ditt NAV
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
