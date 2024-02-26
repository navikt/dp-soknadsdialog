import { Button, Modal } from "@navikt/ds-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSanity } from "../../context/sanity-context";
import { NoSessionError } from "../../svg-icons/NoSessionError";
import styles from "./NoSessionModal.module.css";
import { useSession } from "../../hooks/useSession";

export function NoSessionModal() {
  const router = useRouter();
  const { getAppText } = useSanity();
  const { session, isLoading, isError } = useSession();
  const [timeLeft, setTimeLeft] = useState<number | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [isNagivating, setNavigating] = useState(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_LOCALHOST) {
      if (isLoading) return;

      if (!session || isError) {
        setTimeLeft(1);
        setModalOpen(true);
      }

      if (session?.expiresIn) {
        setTimeLeft(session?.expiresIn);
      }
    }
  }, [session, isLoading, isError]);

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
    window.location.reload();
  }

  function nagivateToNavHomePage() {
    setNavigating(true);
    router.push("https://nav.no/");
  }

  return (
    <Modal
      className="modal-container modal-container--error"
      onClose={() => {}}
      header={{ heading: getAppText("utlopt-sessjon.modal.tittel") }}
      open={modalOpen}
    >
      <Modal.Body>
        <div className={styles.iconContainer}>
          <NoSessionError />
        </div>
        <p>{getAppText("utlopt-sessjon.modal.detaljer")}</p>
        <div className={styles.actionButtonsContainer}>
          <Button variant={"primary"} onClick={login}>
            {getAppText("utlopt-sessjon.modal.knapp.logg-inn")}
          </Button>
          <Button variant={"tertiary"} onClick={nagivateToNavHomePage} loading={isNagivating}>
            {getAppText("utlopt-sessjon.modal.knapp.tilbake")}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
