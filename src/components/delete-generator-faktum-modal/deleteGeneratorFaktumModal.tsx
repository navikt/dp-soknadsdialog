import { Button, Heading, Modal } from "@navikt/ds-react";
import { useEffect } from "react";
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
          {getAppText(`slett-${faktumType}.modal.tittel`)}
        </Heading>

        <p>{getAppText(`slett-${faktumType}.modal.beskrivelse`)}</p>

        <div className="modal-container__button-container">
          <Button variant={"danger"} onClick={props.delete}>
            {getAppText(`slett-${faktumType}.modal.knapp.slett`)}
          </Button>
          <Button variant={"tertiary"} onClick={handleClose}>
            {getAppText(`slett-${faktumType}.modal.knapp.avbryt`)}
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
}
