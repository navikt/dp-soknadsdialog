import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Alert, Button, Heading, Modal } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import { useUuid } from "../../hooks/useUuid";
import { useDeleteRequest } from "../../hooks/useDeleteRequest";
import styles from "./ExitSoknad.module.css";
import { QuizProsess } from "../../types/quiz.types";
import { IDeleteSoknadBody } from "../../pages/api/soknad/delete";
import { useRouter } from "next/router";

interface IProps {
  isOpen: boolean;
  handleClose: () => void;
  prosessType: QuizProsess;
}

export function DeleteProsessModal({ isOpen, handleClose, prosessType }: IProps) {
  const { uuid } = useUuid();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { getAppText } = useSanity();
  const [deleteProsess, deleteProsessStatus, , resetDeleteProsessError] =
    useDeleteRequest<IDeleteSoknadBody>("soknad/delete");

  useEffect(() => {
    if (Modal.setAppElement) {
      Modal.setAppElement("#__next");
    }
  }, []);

  function closeModal() {
    if (deleteProsessStatus === "error") {
      resetDeleteProsessError();
    }
    handleClose();
  }

  function createNewProcess() {
    setIsLoading(true);

    if (prosessType === "Dagpenger") {
      router.push("/soknad/start-soknad");
    } else {
      // window.location.replace for fullpage refresh
      window.location.replace(`${process.env.NEXT_PUBLIC_BASE_PATH}/generell-innsending`);
    }
  }

  return (
    <>
      <Modal
        className="modal-container"
        open={isOpen && deleteProsessStatus === "success"}
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
            <Link href="https://www.nav.no/arbeid/dagpenger/mine-dagpenger" passHref legacyBehavior>
              <Button as="a">
                {getAppText(getDeletedSuccessPrimaryButtonTextKey(prosessType))}
              </Button>
            </Link>
            <Button as="a" variant="tertiary" onClick={createNewProcess} loading={isLoading}>
              {getAppText(getDeletedSuccessSecondaryButtonTextKey(prosessType))}
            </Button>
          </div>
        </Modal.Content>
      </Modal>
      <Modal
        className="modal-container"
        open={isOpen && deleteProsessStatus !== "success"}
        onClose={closeModal}
        closeButton={true}
        shouldCloseOnOverlayClick={true}
      >
        <Modal.Content>
          <Heading size={"medium"} spacing>
            {getAppText(getTitleTextKey(prosessType))}
          </Heading>

          <p>{getAppText(getDescriptionTextKey(prosessType))}</p>

          {deleteProsessStatus === "error" && (
            <>
              <Alert variant="error" className={styles.alertContainer}>
                {getAppText(getDeleteErrorTextKey(prosessType))}
              </Alert>

              <div className="modal-container__button-container">
                <Link
                  href="https://www.nav.no/arbeid/dagpenger/mine-dagpenger"
                  passHref
                  legacyBehavior
                >
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

          {deleteProsessStatus !== "error" && (
            <div className="modal-container__button-container">
              <Button
                variant={"danger"}
                onClick={() => deleteProsess({ uuid })}
                loading={deleteProsessStatus === "pending"}
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
