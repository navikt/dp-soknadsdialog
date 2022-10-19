import { Button, Heading, Modal } from "@navikt/ds-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSanity } from "../../context/sanity-context";
import { NoSessionError } from "../../svg-icons/NoSessionError";
import { useSession } from "../../session.utils";
import styles from "./NoSessionModal.module.css";

export function NoSessionModal() {
  const isLocalhost = process.env.NEXT_PUBLIC_LOCALHOST;

  const router = useRouter();
  const { getAppText } = useSanity();
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
      className="modal-container modal-container--error"
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
          {getAppText("utlopt-sessjon.modal.tittel")}
        </Heading>
        <p>{getAppText("utlopt-sessjon.modal.detaljer")}</p>
        <div className={styles.actionButtonsContainer}>
          <Button variant={"primary"} onClick={login}>
            {getAppText("utlopt-sessjon.modal.knapp.logg-inn")}
          </Button>
          <Button variant={"tertiary"} onClick={() => router.push("https://nav.no/")}>
            {getAppText("utlopt-sessjon.modal.knapp.tilbake")}
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
}
