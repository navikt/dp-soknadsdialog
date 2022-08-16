import { Button, Heading, Modal } from "@navikt/ds-react";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSanity } from "../context/sanity-context";
import styles from "./ErrorModal.module.css";

interface IProps {
  title?: string;
  details?: string;
}

export default function ErrorModal(props: IProps) {
  const { title, details } = props;
  const router = useRouter();
  const { getAppTekst } = useSanity();
  const storage = localStorage.getItem("errorCount");
  const errorCount = storage ? parseInt(storage) : 1;

  useEffect(() => {
    if (Modal.setAppElement) {
      Modal.setAppElement("#__next");
    }
  }, []);

  if (!storage) {
    localStorage.setItem("errorCount", JSON.stringify(1));
  }

  function reload() {
    localStorage.setItem("errorCount", JSON.stringify(errorCount + 1));
    router.reload();
  }

  if (errorCount > 2) {
    router.push("/500");
  }

  return (
    <Modal
      className={classNames("modal-container", [styles.errorModal])}
      onClose={() => {
        return;
      }}
      open={errorCount <= 2}
      closeButton={false}
      shouldCloseOnOverlayClick={false}
    >
      <Modal.Content>
        {title && (
          <Heading size={"medium"} spacing>
            {title}
          </Heading>
        )}
        <div className={styles.errorModalButtonContainer}>
          {details && <p>{details}</p>}
          <Button variant={"primary"} onClick={reload}>
            {getAppTekst("teknisk-feil.reload.knapp-tekst")}
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
}
