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
  const { getAppTekst } = useSanity();

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
          try {
            const response = await saveDokumentkravSvar(uuid as string, dokumentkrav.id, {
              svar: "dokumentkrav.svar.send.senere",
              begrunnelse: "Teknisk feil på innsending av filer",
            });

            if (!response.ok) {
              throw Error(response.statusText);
            }
          } catch (error) {
            setSavingSvarError(true);
          }
        })
      );

      router.push(`/${router.query.uuid}/oppsummering`);
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
            {getAppTekst("dokumentkrav.bundle-error.tittel")}
          </Heading>
          <BodyLong>{getAppTekst("dokumentkrav.bundle-error.beskrivelse")}</BodyLong>

          <ul>
            {dokumentkravList.map((item) => {
              return (
                <li id={item.id} key={item.id}>
                  <DokumentkravTitle dokumentkrav={item} />
                </li>
              );
            })}
          </ul>

          <nav className="navigation-container">
            <Button variant={"secondary"} onClick={() => toggleVisibility(false)}>
              {getAppTekst("dokumentkrav.bundle-error.avbryt")}
            </Button>
            <Button variant={"primary"} onClick={sendDocumentsLater} loading={isSavingSvar}>
              {getAppTekst("dokumentkrav.bundle-error.send.senere")}
            </Button>
          </nav>
        </Modal.Content>
      </Modal>

      {savingSvarError && <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />}
    </>
  );
}
