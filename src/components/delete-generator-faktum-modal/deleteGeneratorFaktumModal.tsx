import { Button, Heading, Modal } from "@navikt/ds-react";
import { useEffect } from "react";
import { useSanity } from "../../context/sanity-context";
// import styles from "./deleteFaktumModal.module.css";

interface IProps {
  isOpen: boolean;
  handleClose: () => void;
}

export function DeleteGeneratorFaktumModal({ isOpen, handleClose }: IProps) {
  const { getAppText } = useSanity();

  useEffect(() => {
    if (Modal.setAppElement) {
      Modal.setAppElement("#__next");
    }
  }, []);

  function closeModal() {
    handleClose();
  }

  return (
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

        <div className="modal-container__button-container">
          <Button
            variant={"danger"}
            // onClick={() => deleteSoknad(uuid)}
            // loading={deleteSoknadStatus === "pending"}
          >
            {getAppText("slett-soknad.modal.knapp.slett")}
          </Button>
          <Button variant={"tertiary"} onClick={closeModal}>
            {getAppText("slett-soknad.modal.knapp.ikke-slett-soknad")}
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
}
