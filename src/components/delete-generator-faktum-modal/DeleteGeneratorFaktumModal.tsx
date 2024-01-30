import { Button, Modal } from "@navikt/ds-react";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { generatorFaktumType } from "../generator-faktum-card/GeneratorFaktumCard";

interface IProps {
  faktumType: generatorFaktumType;
  isOpen: boolean;
  handleClose: () => void;
  delete: (() => void) | undefined;
}

export function DeleteGeneratorFaktumModal(props: IProps): JSX.Element {
  const { getAppText } = useSanity();
  const { faktumType, isOpen, handleClose } = props;
  const { isLoading } = useQuiz();

  return (
    <Modal
      className="modal-container"
      header={{ heading: getAppText(`slett-faktum-${faktumType}.modal.tittel`) }}
      open={isOpen}
      onClose={handleClose}
      closeOnBackdropClick
    >
      <Modal.Body>
        <p>{getAppText(`slett-faktum-${faktumType}.modal.beskrivelse`)}</p>

        <nav className="modal-container__button-container">
          <Button variant={"danger"} onClick={props.delete} loading={isLoading}>
            {getAppText(`slett-faktum-${faktumType}.modal.knapp.slett`)}
          </Button>
          <Button variant={"tertiary"} onClick={handleClose}>
            {getAppText(`slett-faktum-${faktumType}.modal.knapp.avbryt`)}
          </Button>
        </nav>
      </Modal.Body>
    </Modal>
  );
}
