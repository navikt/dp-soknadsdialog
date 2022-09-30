import { Button, Heading, Modal } from "@navikt/ds-react";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSanity } from "../../context/sanity-context";
import { NoSessionError } from "../../svg-icons/NoSessionError";
import { useSession } from "../../session.utils";
import styles from "./NoSessionModal.module.css";

export function NoSessionModal() {
  const isLocalhost = process.env.NEXT_PUBLIC_LOCALHOST;

  const router = useRouter();
  const { getAppTekst } = useSanity();
  const { session } = useSession({ enforceLogin: !isLocalhost });
  const [timeLeft, setTimeLeft] = useState<number | undefined>();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (Modal.setAppElement) {
      Modal.setAppElement("#__next");
    }

    if (session?.expires_in) {
      setTimeLeft(session.expires_in);
    }
  }, [session]);

  useEffect(() => {
    if (!timeLeft) return;

    if (timeLeft === 1) {
      setModalOpen(true);
    }

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  function login() {
    window.location.assign(`${router.basePath}/oauth2/login`);
  }

  return (
    <Modal
      className={classNames("modal-container", [styles.noSessionModal])}
      onClose={() => {
        return;
      }}
      open={modalOpen}
      closeButton={false}
      shouldCloseOnOverlayClick={false}
    >
      <Modal.Content>
        <div className={styles.iconContainer}>
          <NoSessionError />
        </div>
        <Heading size={"medium"} spacing>
          {getAppTekst("utlopt-sessjon.modal.tittel")}
        </Heading>
        <p>{getAppTekst("utlopt-sessjon.modal.detaljer")}</p>
        <div className={styles.actionButtonsContainer}>
          <Button variant={"primary"} onClick={login}>
            {getAppTekst("utlopt-sessjon.modal.login-knapp-tekst")}
          </Button>
          <Button variant={"tertiary"} onClick={() => router.push("https://nav.no/")}>
            {getAppTekst("utlopt-sessjon.modal.tilbake-knapp-tekst")}
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
}
