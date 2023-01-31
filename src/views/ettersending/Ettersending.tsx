import React, { useEffect, useRef } from "react";
import { IDokumentkrav, IDokumentkravList } from "../../types/documentation.types";
import { EttersendingDokumentkravSendingItem } from "./EttersendingDokumentkravSendingItem";
import { Button, ErrorSummary, Heading } from "@navikt/ds-react";
import { useScrollIntoView } from "../../hooks/useScrollIntoView";
import { useDokumentkravBundler } from "../../hooks/useDokumentkravBundler";
import { useRouter } from "next/router";
import { usePutRequest } from "../../hooks/usePutRequest";
import { useUuid } from "../../hooks/useUuid";
import { useSetFocus } from "../../hooks/useSetFocus";
import { useSanity } from "../../context/sanity-context";
import { DokumentkravTitle } from "../../components/dokumentkrav-title/DokumentkravTitle";
import { PortableText } from "@portabletext/react";
import { SoknadHeader } from "../../components/soknad-header/SoknadHeader";
import {
  DOKUMENTKRAV_SVAR_SEND_NAA,
  DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE,
  DOKUMENTKRAV_SVAR_SENDER_IKKE,
  DOKUMENTKRAV_SVAR_SENDER_SENERE,
  DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE,
} from "../../constants";
import { DokumentkravGenerellInnsending } from "../../components/dokumentkrav-generell-innsending/DokumentkravGenerellInnsending";
import { EttersendingDokumentkravNotSending } from "./EttersendingDokumentkravNotSending";
import Link from "next/link";
import { ValidationMessage } from "../../components/faktum/validation/ValidationMessage";
import { IEttersendBody } from "../../pages/api/soknad/ettersend";

interface IProps {
  dokumentkrav: IDokumentkravList;
}

export function Ettersending({ dokumentkrav }: IProps) {
  const router = useRouter();
  const { uuid } = useUuid();
  const { setFocus } = useSetFocus();
  const { scrollIntoView } = useScrollIntoView();
  const { getAppText, getInfosideText } = useSanity();
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const ettersendingText = getInfosideText("ettersending.informasjon");
  const [ettersendSoknad, ettersendSoknadStatus] =
    usePutRequest<IEttersendBody>("soknad/ettersend");
  const {
    isBundling,
    noDocumentsToSave,
    dokumentkravWithBundleError,
    dokumentkravWithNewFiles,
    isAllDokumentkravValid,
    removeDokumentkrav,
    bundleAndSaveDokumentkrav,
    addDokumentkravWithNewFiles,
  } = useDokumentkravBundler();

  const availableDokumentkravForEttersending: IDokumentkrav[] = dokumentkrav.krav.filter(
    (krav: IDokumentkrav): boolean =>
      krav.svar === DOKUMENTKRAV_SVAR_SEND_NAA || krav.svar === DOKUMENTKRAV_SVAR_SENDER_SENERE
  );

  const missingDokumentkrav: IDokumentkrav[] = availableDokumentkravForEttersending.filter(
    (krav: IDokumentkrav): boolean => !krav.bundleFilsti
  );
  const receivedDokumentkrav: IDokumentkrav[] = availableDokumentkravForEttersending.filter(
    (krav: IDokumentkrav): boolean => !!krav.bundleFilsti
  );

  const unavailableDokumentkravForEttersending: IDokumentkrav[] = dokumentkrav.krav.filter(
    (krav: IDokumentkrav) =>
      krav.svar === DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE ||
      krav.svar === DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE ||
      krav.svar === DOKUMENTKRAV_SVAR_SENDER_IKKE
  );

  useEffect(() => {
    if (dokumentkravWithBundleError.length > 0) {
      scrollIntoView(errorSummaryRef);
      setFocus(errorSummaryRef);
    }
  }, [dokumentkravWithBundleError.length]);

  useEffect(() => {
    if (ettersendSoknadStatus === "success") {
      router.push(`/soknad/${uuid}/kvittering`);
    }
  }, [ettersendSoknadStatus]);

  async function bundleAndSaveAllDokumentkrav() {
    if (isAllDokumentkravValid()) {
      let readyToEttersend = true;
      for (const dokumentkrav of dokumentkravWithNewFiles) {
        const res = await bundleAndSaveDokumentkrav(dokumentkrav);
        if (!res) {
          readyToEttersend = false;
        }
      }

      if (readyToEttersend) {
        ettersendSoknad({ uuid });
      }
    }
  }

  return (
    <div>
      <SoknadHeader titleTextKey={"ettersending.tittel"} />

      {dokumentkravWithBundleError.length > 0 && (
        <ErrorSummary
          size="medium"
          ref={errorSummaryRef}
          heading={getAppText("ettersending.feilmelding.oppsummering.tittel")}
        >
          {dokumentkravWithBundleError.map((krav) => (
            <ErrorSummary.Item key={krav.id} href={`#${krav.id}`}>
              <DokumentkravTitle dokumentkrav={krav} />
            </ErrorSummary.Item>
          ))}
        </ErrorSummary>
      )}

      {ettersendingText && (
        <div className="my-12">
          <PortableText value={ettersendingText.body} />
        </div>
      )}

      {availableDokumentkravForEttersending.length > 0 && (
        <>
          <Heading level="2" size="medium" className="my-6">
            {getAppText("ettersending.dokumenter.innsending.tittel")}
          </Heading>

          {missingDokumentkrav.map((krav) => (
            <EttersendingDokumentkravSendingItem
              key={krav.id}
              dokumentkrav={krav}
              removeDokumentkrav={removeDokumentkrav}
              addDokumentkrav={addDokumentkravWithNewFiles}
              hasBundleError={
                !dokumentkravWithBundleError.findIndex(
                  (dokumentkrav) => dokumentkrav.id === krav.id
                )
              }
            />
          ))}

          {receivedDokumentkrav.map((krav) => (
            <EttersendingDokumentkravSendingItem
              key={krav.id}
              dokumentkrav={krav}
              removeDokumentkrav={removeDokumentkrav}
              addDokumentkrav={addDokumentkravWithNewFiles}
              hasBundleError={
                !dokumentkravWithBundleError.findIndex(
                  (dokumentkrav) => dokumentkrav.id === krav.id
                )
              }
            />
          ))}

          {noDocumentsToSave && (
            <ValidationMessage message={getAppText("ettersending.validering.ingen-dokumenter")} />
          )}

          <nav className="navigation-container">
            <Button
              variant="primary"
              onClick={bundleAndSaveAllDokumentkrav}
              loading={isBundling || ettersendSoknadStatus === "pending"}
              disabled={ettersendSoknadStatus === "success"}
            >
              {getAppText("ettersending.knapp.send-inn-dokumenter")}
            </Button>

            <Link href={`/soknad/${uuid}/kvittering`} passHref>
              <Button as="a" variant="secondary">
                {getAppText("ettersending.knapp.avbryt")}
              </Button>
            </Link>
          </nav>
        </>
      )}

      {unavailableDokumentkravForEttersending.length > 0 && (
        <EttersendingDokumentkravNotSending
          classname={"my-11"}
          dokumentkrav={unavailableDokumentkravForEttersending}
        />
      )}

      <DokumentkravGenerellInnsending classname={"my-11"} />
    </div>
  );
}
