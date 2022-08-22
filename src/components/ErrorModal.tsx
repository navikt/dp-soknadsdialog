import { Button, Heading, Modal } from "@navikt/ds-react";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSanity } from "../context/sanity-context";
import { ErrorTypesEnum } from "../types/error.types";
import styles from "./ErrorModal.module.css";

interface IProps {
  errorType: ErrorTypesEnum;
}

export default function ErrorModal(props: IProps) {
  const { errorType } = props;
  const router = useRouter();
  const { getAppTekst } = useSanity();
  const [errorMessage, setErrorMessage] = useState("");
  const [errorsCount, setErrorsCount] = useState(1);

  useEffect(() => {
    if (Modal.setAppElement) {
      Modal.setAppElement("#__next");
    }

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
        return getAppTekst("teknisk-feil.modal.detaljer.generell");
      case ErrorTypesEnum.GetNesteError:
        return getAppTekst("teknisk-feil.modal.detaljer.hent-neste");
      case ErrorTypesEnum.SaveFaktumError:
        return getAppTekst("teknisk-feil.modal.detaljer.lagre-faktum");
      case ErrorTypesEnum.SendSoknadError:
        return getAppTekst("teknisk-feil.modal.detaljer.send-soknad");
      default:
        return getAppTekst("teknisk-feil.modal.detaljer.generell");
    }
  }

  function reload() {
    localStorage.setItem("errorsCount", JSON.stringify(errorsCount + 1));
    router.reload();
  }

  if (errorsCount > 2) {
    router.push("/500");
  }

  return (
    <Modal
      className={classNames("modal-container", [styles.errorModal])}
      onClose={() => {
        return;
      }}
      open={errorsCount <= 2}
      closeButton={false}
      shouldCloseOnOverlayClick={false}
    >
      <Modal.Content>
        <Heading size={"medium"} spacing>
          {getAppTekst("teknisk-feil.modal.tittel")}
        </Heading>
        <div className={styles.errorModalButtonContainer}>
          <p>{errorMessage}</p>
          <Button variant={"primary"} onClick={reload}>
            {getAppTekst("teknisk-feil.modal.knapp-tekst")}
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
}
