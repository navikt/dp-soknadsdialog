import { Button, Heading, Modal, BodyLong } from "@navikt/ds-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSanity } from "../../context/sanity-context";
import { ErrorTypesEnum } from "../../types/error.types";
import styles from "./ErrorRetryModal.module.css";

interface IProps {
  errorType: ErrorTypesEnum;
}

export function ErrorRetryModal(props: IProps) {
  const { errorType } = props;
  const router = useRouter();
  const { getAppText } = useSanity();
  const [errorMessage, setErrorMessage] = useState("");
  const [errorsCount, setErrorsCount] = useState(1);
  const [nagivating, setNagivating] = useState(false);

  useEffect(() => {
    const localStorageErrorsCount = localStorage.getItem("errorsCount");
    if (localStorageErrorsCount) {
      setErrorsCount(parseInt(localStorageErrorsCount));
    } else {
      localStorage.setItem("errorsCount", JSON.stringify(1));
    }

    setErrorMessage(getErrorMessageByType());
  }, []);

  function getErrorMessageByType() {
    switch (errorType) {
      case ErrorTypesEnum.GenericError:
        return getAppText("teknisk-feil.modal.detaljer.generell-feil");
      case ErrorTypesEnum.GetNesteError:
        return getAppText("teknisk-feil.modal.detaljer.hent-neste");
      case ErrorTypesEnum.SaveFaktumError:
        return getAppText("teknisk-feil.modal.detaljer.lagre-faktum");
      case ErrorTypesEnum.SendSoknadError:
        return getAppText("teknisk-feil.modal.detaljer.send-soknad");
      default:
        return getAppText("teknisk-feil.modal.detaljer.generell-feil");
    }
  }

  function reload() {
    localStorage.setItem("errorsCount", JSON.stringify(errorsCount + 1));
    router.reload();
  }

  if (errorsCount > 2) {
    setNagivating(true);
    router.push("/500");
  }

  return (
    <Modal
      className="modal-container modal-container--error"
      onClose={() => {
        return;
      }}
      open={errorsCount <= 2}
    >
      <Modal.Body>
        <Heading size={"medium"} spacing>
          {getAppText("teknisk-feil.modal.tittel")}
        </Heading>
        <BodyLong className={styles.body}>{errorMessage}</BodyLong>
        <Button
          className={styles.errorRetryModalButton}
          variant={"primary"}
          onClick={reload}
          loading={nagivating}
        >
          {getAppText("teknisk-feil.modal.knapp.prov-paa-nytt")}
        </Button>
      </Modal.Body>
    </Modal>
  );
}
