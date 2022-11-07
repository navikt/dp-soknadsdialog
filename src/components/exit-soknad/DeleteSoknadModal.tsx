import React, { useEffect } from "react";
import Link from "next/link";
import { Alert, Button, Heading, Modal } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import { useUuid } from "../../hooks/useUuid";
import { useDeleteRequest } from "../../hooks/useDeleteRequest";
import styles from "./ExitSoknad.module.css";

interface IProps {
  isOpen: boolean;
  handleClose: () => void;
}

export function DeleteSoknadModal({ isOpen, handleClose }: IProps) {
  const { uuid } = useUuid();
  const { getAppText } = useSanity();
  const [deleteSoknad, deleteSoknadStatus, , resetDeleteSoknadError] =
    useDeleteRequest("soknad/delete");

  useEffect(() => {
    if (Modal.setAppElement) {
      Modal.setAppElement("#__next");
    }
  }, []);

  function closeModal() {
    if (deleteSoknadStatus === "error") {
      resetDeleteSoknadError();
    }
    handleClose();
  }

  return (
    <>
      {deleteSoknadStatus === "success" && (
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

      {deleteSoknadStatus !== "success" && (
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

            {deleteSoknadStatus === "error" && (
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

            {deleteSoknadStatus !== "error" && (
              <div className="modal-container__button-container">
                <Button
                  variant={"danger"}
                  onClick={() => deleteSoknad(uuid)}
                  loading={deleteSoknadStatus === "pending"}
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
