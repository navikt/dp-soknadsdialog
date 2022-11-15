import { BodyLong, Button, Heading, Modal } from "@navikt/ds-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { saveDokumentkravSvar } from "../../api/dokumentasjon-api";
import { useSanity } from "../../context/sanity-context";
import { IDokumentkrav } from "../../types/documentation.types";
import { ErrorTypesEnum } from "../../types/error.types";
import { ErrorRetryModal } from "../error-retry-modal/ErrorRetryModal";
import { DokumentkravTitle } from "./DokumentkravTitle";

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
  const { uuid } = router.query;
  const { getAppText } = useSanity();

  const [isSavingSvar, setIsSavingSvar] = useState(false);
  const [savingSvarError, setSavingSvarError] = useState(false);

  useEffect(() => {
    if (Modal.setAppElement) {
      Modal.setAppElement("#__next");
    }
  }, []);

  async function sendDocumentsLater() {
    setIsSavingSvar(true);

    try {
      await Promise.all(
        dokumentkravList.map(async (dokumentkrav) => {
          const response = await saveDokumentkravSvar(uuid as string, dokumentkrav.id, {
            svar: "dokumentkrav.svar.send.senere",
            begrunnelse: "Teknisk feil på innsending av filer",
          });

          if (!response.ok) {
            throw Error(response.statusText);
          }
        })
      );

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
        closeButton={false}
        onClose={() => toggleVisibility(false)}
        open={isOpen}
        shouldCloseOnOverlayClick={false}
      >
        <Modal.Content>
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
        </Modal.Content>
      </Modal>

      {savingSvarError && <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />}
    </>
  );
}
