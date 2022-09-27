import { BodyLong, Button, Heading, Modal } from "@navikt/ds-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { saveDokumentkravSvar } from "../../api/dokumentasjon-api";
import { useSanity } from "../../context/sanity-context";
import { IDokumentkrav } from "../../types/documentation.types";
import { ErrorTypesEnum } from "../../types/error.types";
import soknadStyles from "../../views/Soknad.module.css";
import { ErrorRetryModal } from "../error-retry-modal/ErrorRetryModal";
import { DokumentkravTitle } from "./DokumentkravTitle";

interface IProps {
  dokumentkravList: IDokumentkrav[];
}

export function DokumentkravBundleErrorModal({ dokumentkravList }: IProps) {
  const router = useRouter();
  const { uuid } = router.query;
  const { getAppTekst } = useSanity();

  const [showModal, setShowModal] = useState(true);
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
      setShowModal(false);
      setSavingSvarError(true);
    }
  }

  return (
    <>
      <Modal
        className="modal-container modal-container--error"
        closeButton={false}
        onClose={() => undefined}
        open={showModal}
        shouldCloseOnOverlayClick={false}
      >
        <Modal.Content>
          <Heading size={"medium"} spacing>
            {getAppTekst("dokumentasjonskrav.feilmelding.bundling.header")}
          </Heading>
          <BodyLong>{getAppTekst("dokumentasjonskrav.feilmelding.bundling.beskrivelse")}</BodyLong>

          <ul>
            {dokumentkravList.map((item) => {
              return (
                <li id={item.id} key={item.id}>
                  <DokumentkravTitle dokumentkrav={item} />
                </li>
              );
            })}
          </ul>

          <nav className={soknadStyles.navigation}>
            <Button variant={"secondary"} onClick={() => setShowModal(false)}>
              Avbryt
            </Button>
            <Button variant={"primary"} onClick={sendDocumentsLater} loading={isSavingSvar}>
              Send inn dokumenter senere
            </Button>
          </nav>
        </Modal.Content>
      </Modal>

      {savingSvarError && <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />}
    </>
  );
}
