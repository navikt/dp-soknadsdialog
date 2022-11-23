import React, { useEffect } from "react";
import Link from "next/link";
import { Alert, Button, Heading, Modal } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import { useUuid } from "../../hooks/useUuid";
import { useDeleteRequest } from "../../hooks/useDeleteRequest";
import styles from "./ExitSoknad.module.css";
import { QuizProsess } from "../../types/quiz.types";

interface IProps {
  isOpen: boolean;
  handleClose: () => void;
  prosessType: QuizProsess;
}

export function DeleteProsessModal({ isOpen, handleClose, prosessType }: IProps) {
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
              {getAppText(getDeletedSuccessTitleTextKey(prosessType))}
            </Heading>

            <p>{getAppText(getDeletedSuccessDescriptionTextKey(prosessType))}</p>

            <div className="modal-container__button-container">
              <Link href="https://www.nav.no/mine-dagpenger" passHref>
                <Button as="a">
                  {getAppText(getDeletedSuccessPrimaryButtonTextKey(prosessType))}
                </Button>
              </Link>

              <Link
                href={prosessType === "Dagpenger" ? "/soknad/start-soknad" : "/generell-innsending"}
                passHref
              >
                <Button as="a" variant="tertiary">
                  {getAppText(getDeletedSuccessSecondaryButtonTextKey(prosessType))}
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
              {getAppText(getTitleTextKey(prosessType))}
            </Heading>

            <p>{getAppText(getDescriptionTextKey(prosessType))}</p>

            {deleteSoknadStatus === "error" && (
              <>
                <Alert variant="error" className={styles.alertContainer}>
                  {getAppText(getDeleteErrorTextKey(prosessType))}
                </Alert>

                <div className="modal-container__button-container">
                  <Link href="https://www.nav.no/arbeid/dagpenger/mine-dagpenger" passHref>
                    <Button as="a">
                      {getAppText(getDeleteErrorPrimaryButtonTextKey(prosessType))}
                    </Button>
                  </Link>

                  <Button variant={"tertiary"} onClick={closeModal}>
                    {getAppText(getDeleteErrorSecondaryButtonTextKey(prosessType))}
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
                  {getAppText(getDeleteButtonTextKey(prosessType))}
                </Button>
                <Button variant={"tertiary"} onClick={closeModal}>
                  {getAppText(getDeleteCancelButtonTextKey(prosessType))}
                </Button>
              </div>
            )}
          </Modal.Content>
        </Modal>
      )}
    </>
  );
}

function getTitleTextKey(prosess: QuizProsess) {
  switch (prosess) {
    case "Dagpenger":
      return "slett-soknad.modal.tittel";
    case "Innsending":
      return "slett-prosess.innsending.modal.tittel";
  }
}

function getDescriptionTextKey(prosess: QuizProsess) {
  switch (prosess) {
    case "Dagpenger":
      return "slett-soknad.modal.beskrivelse";
    case "Innsending":
      return "slett-prosess.innsending.modal.beskrivelse";
  }
}

function getDeleteErrorTextKey(prosess: QuizProsess) {
  switch (prosess) {
    case "Dagpenger":
      return "slett-soknad.modal.varsel.klarte-ikke-slette";
    case "Innsending":
      return "slett-prosess.innsending.modal.varsel.klarte-ikke-slette";
  }
}

function getDeleteErrorPrimaryButtonTextKey(prosess: QuizProsess) {
  switch (prosess) {
    case "Dagpenger":
      return "slett-soknad.modal.knapp.til-mine-dagpenger";
    case "Innsending":
      return "slett-prosess.innsending.modal.knapp.til-mine-dagpenger";
  }
}

function getDeleteErrorSecondaryButtonTextKey(prosess: QuizProsess) {
  switch (prosess) {
    case "Dagpenger":
      return "slett-soknad.modal.knapp.avbryt";
    case "Innsending":
      return "slett-prosess.innsending.modal.knapp.avbryt";
  }
}

function getDeleteButtonTextKey(prosess: QuizProsess) {
  switch (prosess) {
    case "Dagpenger":
      return "slett-soknad.modal.knapp.slett";
    case "Innsending":
      return "slett-prosess.innsending.modal.knapp.slett";
  }
}

function getDeleteCancelButtonTextKey(prosess: QuizProsess) {
  switch (prosess) {
    case "Dagpenger":
      return "slett-soknad.modal.knapp.ikke-slett-soknad";
    case "Innsending":
      return "slett-prosess.innsending.modal.knapp.ikke-slett";
  }
}

function getDeletedSuccessTitleTextKey(prosess: QuizProsess) {
  switch (prosess) {
    case "Dagpenger":
      return "soknad-slettet.modal.tittel";
    case "Innsending":
      return "prosess-slettet.innsending.modal.tittel";
  }
}

function getDeletedSuccessDescriptionTextKey(prosess: QuizProsess) {
  switch (prosess) {
    case "Dagpenger":
      return "soknad-slettet.modal.beskrivelse";
    case "Innsending":
      return "prosess-slettet.innsending.modal.beskrivelse";
  }
}

function getDeletedSuccessPrimaryButtonTextKey(prosess: QuizProsess) {
  switch (prosess) {
    case "Dagpenger":
      return "soknad-slettet.modal.knapp.lukk";
    case "Innsending":
      return "prosess-slettet.innsending.modal.knapp.lukk";
  }
}

function getDeletedSuccessSecondaryButtonTextKey(prosess: QuizProsess) {
  switch (prosess) {
    case "Dagpenger":
      return "soknad-slettet.modal.knapp.start-ny-soknad";
    case "Innsending":
      return "prosess-slettet.innsending.modal.knapp.start-ny";
  }
}
