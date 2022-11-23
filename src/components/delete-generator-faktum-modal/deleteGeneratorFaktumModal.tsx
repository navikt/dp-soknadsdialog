import { Button, Heading, Modal } from "@navikt/ds-react";
import { useEffect } from "react";

interface IProps {
  title: string;
  description: string;
  deleteButtonText: string;
  cancelButtonText: string;
  isOpen: boolean;
  handleClose: () => void;
  delete: (() => void) | undefined;
}

export function DeleteGeneratorFaktumModal(props: IProps) {
  const { title, description, deleteButtonText, cancelButtonText, isOpen, handleClose } = props;

  useEffect(() => {
    if (Modal.setAppElement) {
      Modal.setAppElement("#__next");
    }
  }, []);

  return (
    <Modal
      className="modal-container"
      open={isOpen}
      onClose={handleClose}
      closeButton={true}
      shouldCloseOnOverlayClick={true}
    >
      <Modal.Content>
        <Heading size={"medium"} spacing>
          {title}
        </Heading>

        <p>{description}</p>

        <div className="modal-container__button-container">
          <Button variant={"danger"} onClick={props.delete}>
            {deleteButtonText}
          </Button>
          <Button variant={"tertiary"} onClick={handleClose}>
            {cancelButtonText}
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
}
