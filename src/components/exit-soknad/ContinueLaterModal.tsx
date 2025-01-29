import { Button, Modal } from "@navikt/ds-react";
import Link from "next/link";
import { useSanity } from "../../context/sanity-context";

interface IProps {
  isOpen: boolean;
  handleClose: () => void;
}

export function ContinueLaterModal({ isOpen, handleClose }: IProps) {
  const { getAppText } = useSanity();

  return (
    <Modal
      className="modal-container"
      header={{ heading: getAppText("fortsett-soknad-senere.modal.tittel") }}
      open={isOpen}
      onClose={handleClose}
      closeOnBackdropClick
    >
      <Modal.Body>
        <p>{getAppText("fortsett-soknad-senere.modal.beskrivelse")}</p>

        <Link href="https://www.nav.no/arbeid/dagpenger/mine-dagpenger" passHref legacyBehavior>
          <Button as="a" variant="primary">
            {getAppText("fortsett-soknad-senere.modal.knapp.til-mine-dagpenger")}
          </Button>
        </Link>
      </Modal.Body>
    </Modal>
  );
}
