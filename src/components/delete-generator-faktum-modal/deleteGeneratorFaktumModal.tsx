import { Button, Heading, Modal } from "@navikt/ds-react";
import { useEffect } from "react";

interface IProps {
  title: string;
  description: string;
  deleteButtonText: string;
  cancelButtonText: string;
  isOpen: boolean;
  handleClose: () => void;
}

export function DeleteGeneratorFaktumModal(props: IProps) {
  const { title, description, deleteButtonText, cancelButtonText, isOpen, handleClose } = props;

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
          {title}
        </Heading>

        <p>{description}</p>

        <div className="modal-container__button-container">
          <Button
            variant={"danger"}
            // onClick={() => deleteSoknad(uuid)}
            // loading={deleteSoknadStatus === "pending"}
          >
            {deleteButtonText}
          </Button>
          <Button variant={"tertiary"} onClick={closeModal}>
            {cancelButtonText}
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
}
