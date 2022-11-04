import React, { useEffect } from "react";
import Link from "next/link";
import { Alert, Button, Heading, Modal } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import { deleteSoknad } from "../../api/deleteSoknad-api";
import { useAsync } from "../../hooks/useAsync";
import { useUuid } from "../../hooks/useUuid";
import styles from "./ExitSoknad.module.css";

interface IProps {
  isOpen: boolean;
  handleClose: () => void;
}

export function DeleteSoknadModal({ isOpen, handleClose }: IProps) {
  const { uuid } = useUuid();
  const { getAppText } = useSanity();
  const deleteSoknadAsync = useAsync(() => deleteSoknad(uuid));

  useEffect(() => {
    if (Modal.setAppElement) {
      Modal.setAppElement("#__next");
    }
  }, []);

  function closeModal() {
    if (deleteSoknadAsync.status === "error") {
      deleteSoknadAsync.reset();
    }
    handleClose();
  }

  return (
    <>
      {deleteSoknadAsync.status === "success" && (
        <Modal
          className="modal-container"
          open={isOpen}
          onClose={() => undefined}
          closeButton={false}
          shouldCloseOnOverlayClick={false}
        >
          <Modal.Content>
            <Heading size={"medium"} spacing>
              {getAppText("soknad-slettet.modal.tittel")}
            </Heading>

            <p>{getAppText("soknad-slettet.modal.beskrivelse")}</p>

            <div className="modal-container__button-container">
              <Link href="https://www.nav.no/minside" passHref>
                <Button as="a">{getAppText("soknad-slettet.modal.knapp.lukk")}</Button>
              </Link>

              <Link href="/start-soknad" passHref>
                <Button as="a" variant="tertiary">
                  {getAppText("soknad-slettet.modal.knapp.start-ny-soknad")}
                </Button>
              </Link>
            </div>
          </Modal.Content>
        </Modal>
      )}

      {deleteSoknadAsync.status !== "success" && (
        <Modal
          className="modal-container"
          open={isOpen}
          onClose={closeModal}
          closeButton={true}
          shouldCloseOnOverlayClick={true}
        >
          <Modal.Content>
            <Heading size={"medium"} spacing>
              {getAppText("slett-soknad.modal.tittel")}
            </Heading>

            <p>{getAppText("slett-soknad.modal.beskrivelse")}</p>

            {deleteSoknadAsync.status === "error" && (
              <>
                <Alert variant="error" className={styles.alertContainer}>
                  {getAppText("slett-soknad.modal.varsel.klarte-ikke-slette")}
                </Alert>

                <div className="modal-container__button-container">
                  <Link href="https://www.nav.no/arbeid/dagpenger/mine-dagpenger" passHref>
                    <Button as="a">
                      {getAppText("slett-soknad.modal.knapp.til-mine-dagpenger")}
                    </Button>
                  </Link>

                  <Button variant={"tertiary"} onClick={closeModal}>
                    {getAppText("slett-soknad.modal.knapp.avbryt")}
                  </Button>
                </div>
              </>
            )}

            {deleteSoknadAsync.status !== "error" && (
              <div className="modal-container__button-container">
                <Button
                  variant={"danger"}
                  onClick={deleteSoknadAsync.execute}
                  loading={deleteSoknadAsync.status === "pending"}
                >
                  {getAppText("slett-soknad.modal.knapp.slett")}
                </Button>
                <Button variant={"tertiary"} onClick={closeModal}>
                  {getAppText("slett-soknad.modal.knapp.ikke-slett-soknad")}
                </Button>
              </div>
            )}
          </Modal.Content>
        </Modal>
      )}
    </>
  );
}
