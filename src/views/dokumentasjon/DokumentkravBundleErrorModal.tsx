import { BodyLong, Button, Heading, Modal } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { DokumentkravTitle } from "../../components/dokumentkrav-title/DokumentkravTitle";
import { ErrorRetryModal } from "../../components/error-retry-modal/ErrorRetryModal";
import { useSanity } from "../../context/sanity-context";
import { usePutRequest } from "../../hooks/request/usePutRequest";
import { useUuid } from "../../hooks/useUuid";
import { IDokumentkravSvarBody } from "../../pages/api/documentation/svar";
import { IDokumentkrav } from "../../types/documentation.types";
import { ErrorTypesEnum } from "../../types/error.types";

interface IProps {
  dokumentkravList: IDokumentkrav[];
  isOpen: boolean;
  toggleVisibility: (val: boolean) => void;
}

export function DokumentkravBundleErrorModal({
  dokumentkravList,
  isOpen,
  toggleVisibility,
}: IProps) {
  const router = useRouter();
  const { uuid } = useUuid();
  const { getAppText } = useSanity();
  const [isSavingSvar, setIsSavingSvar] = useState(false);
  const [savingSvarError, setSavingSvarError] = useState(false);
  const [saveDokumentkravSvar, , saveDokumentkravSvarError] =
    usePutRequest<IDokumentkravSvarBody>("documentation/svar");

  async function sendDocumentsLater() {
    setIsSavingSvar(true);

    try {
      for (const dokumentkrav of dokumentkravList) {
        const responseOk = await saveDokumentkravSvar({
          uuid,
          dokumentkravId: dokumentkrav.id,
          dokumentkravSvar: {
            svar: "dokumentkrav.svar.send.senere",
            begrunnelse: "Teknisk feil på innsending av filer",
          },
        });

        if (!responseOk) {
          throw Error(saveDokumentkravSvarError.message);
        }
      }

      router.push(`/soknad/${router.query.uuid}/oppsummering`);
    } catch {
      setIsSavingSvar(false);
      toggleVisibility(false);
      setSavingSvarError(true);
    }
  }

  return (
    <>
      <Modal
        className="modal-container modal-container--error"
        onClose={() => toggleVisibility(false)}
        open={isOpen}
      >
        <Modal.Body>
          <Heading size={"medium"} spacing>
            {getAppText("dokumentkrav.bundle-error-modal.tittel")}
          </Heading>
          <BodyLong>{getAppText("dokumentkrav.bundle-error-modal.beskrivelse")}</BodyLong>

          <ul>
            {dokumentkravList.map((item) => (
              <li id={item.id} key={item.id}>
                <DokumentkravTitle dokumentkrav={item} />
              </li>
            ))}
          </ul>

          <nav className="navigation-container">
            <Button variant={"secondary"} onClick={() => toggleVisibility(false)}>
              {getAppText("dokumentkrav.bundle-error-modal.knapp.avbryt")}
            </Button>
            <Button variant={"primary"} onClick={sendDocumentsLater} loading={isSavingSvar}>
              {getAppText("dokumentkrav.bundle-error-modal.knapp.send-senere")}
            </Button>
          </nav>
        </Modal.Body>
      </Modal>

      {savingSvarError && <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />}
    </>
  );
}
