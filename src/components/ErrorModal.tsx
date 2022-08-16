import { Button, Heading, Modal } from "@navikt/ds-react";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSanity } from "../context/sanity-context";
import styles from "./ErrorModal.module.css";

interface IProps {
  title?: string;
  details?: string;
}

export default function ErrorModal(props: IProps) {
  const { title, details } = props;
  const router = useRouter();
  const [reloadCount, setReloadCount] = useState<number>(0);
  const { getAppTekst } = useSanity();

  useEffect(() => {
    if (Modal.setAppElement) {
      Modal.setAppElement("#__next");
    }
  }, []);

  useEffect(() => {
    const storedReloadCount = localStorage.getItem("reloadCount");

    if (!storedReloadCount) {
      localStorage.setItem("reloadCount", JSON.stringify(0));
    } else {
      setReloadCount(parseInt(storedReloadCount));
    }

    if (storedReloadCount && parseInt(storedReloadCount) >= 2) {
      localStorage.setItem("reloadCount", JSON.stringify(0));
      router.push("/500");
    }
  }, []);

  function increaseReloadCount() {
    setReloadCount(reloadCount + 1);
    localStorage.setItem("reloadCount", JSON.stringify(reloadCount + 1));
  }

  function refresh() {
    increaseReloadCount();
    router.reload();
  }

  return (
    <Modal
      className={classNames("modal-container", [styles.errorModal])}
      onClose={() => {
        return false;
      }}
      open={true}
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
          <Button variant={"primary"} onClick={refresh}>
            {getAppTekst("teknisk-feil.reload.knapp-tekst")}
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
}
