import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Alert, Button, Heading, Modal } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import { deleteSoknad } from "../../api/deleteSoknad-api";
import { useRouter } from "next/router";
import styles from "./ExitSoknad.module.css";

interface IProps {
  isOpen: boolean;
  handleClose: () => void;
}

export function DeleteSoknadModal({ isOpen, handleClose }: IProps) {
  const router = useRouter();
  const uuid = router.query.uuid as string;
  const { getAppText } = useSanity();
  const [isSoknadDeleted, setIsSoknadDeleted] = useState(false);
  const [isDeletingSoknad, setIsDeletingSoknad] = useState(false);
  const [hasErrorDeletingSoknad, setHasErrorDeletingSoknad] = useState(false);

  useEffect(() => {
    if (Modal.setAppElement) {
      Modal.setAppElement("#__next");
    }
  }, []);

  async function deleteCurrentSoknad() {
    hasErrorDeletingSoknad && setHasErrorDeletingSoknad(false);
    setIsDeletingSoknad(true);

    try {
      const deleteResponse = await deleteSoknad(uuid);

      if (deleteResponse.ok) {
        setIsSoknadDeleted(true);
        setIsDeletingSoknad(false);
      } else {
        setHasErrorDeletingSoknad(true);
        setIsDeletingSoknad(false);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  function closeModal() {
    if (hasErrorDeletingSoknad) {
      setHasErrorDeletingSoknad(false);
    }

    handleClose();
  }

  return (
    <>
      {isSoknadDeleted && (
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

              <Link href="/" passHref>
                <Button as="a" variant="tertiary">
                  {getAppText("soknad-slettet.modal.knapp.start-ny-soknad")}
                </Button>
              </Link>
            </div>
          </Modal.Content>
        </Modal>
      )}

      {!isSoknadDeleted && (
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

            {hasErrorDeletingSoknad && (
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

            {!hasErrorDeletingSoknad && (
              <div className="modal-container__button-container">
                <Button variant={"danger"} onClick={deleteCurrentSoknad} loading={isDeletingSoknad}>
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
