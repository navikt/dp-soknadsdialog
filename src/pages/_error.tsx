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

export default function Error(props: IProps) {
  const { statusCode, title, details } = props;

  useEffect(() => {
    if (statusCode === 404) {
      window.location.assign("https://www.nav.no/minside/");
    }
  }, []);

  useEffect(() => {
    if (Modal.setAppElement) {
      Modal.setAppElement("#__next");
    }
  }, []);

  if (statusCode === 404) {
    return (
      <>
        <div className={styles.iconContainer}>
          <TechnicalError />
        </div>
        <Heading level="1" size="xlarge">
          Fant ikke siden
        </Heading>
        <BodyLong>
          Beklager, siden kan være slettet eller flyttet, eller det var en feil i lenken som førte
          deg hit.
        </BodyLong>
      </>
    );
  }

  function gotoDittNav() {
    window.location.assign("https://www.nav.no/no/ditt-nav");
  }

  return (
    <>
      <Modal
        className={classNames("modal-container", [styles.errorModal])}
        onClose={() => {
          return;
        }}
        open={true}
        closeButton={false}
        shouldCloseOnOverlayClick={false}
      >
        <Modal.Content>
          <div className={styles.iconContainer}>
            <TechnicalError />
          </div>
          <Heading size={"medium"} spacing>
            {title}
          </Heading>
          <div className={styles.errorModalButtonContainer}>
            <p>{details}</p>
            <Button
              variant="primary"
              size="medium"
              onClick={() => gotoDittNav()}
              className={styles.actionButton}
            >
              Gå til Ditt NAV
            </Button>
          </div>
        </Modal.Content>
      </Modal>
    </>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
