import React, { useEffect, useRef, useState } from "react";
import { IDokumentkrav } from "../../types/documentation.types";
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
import { useDokumentkrav } from "../../context/dokumentkrav-context";

export function Ettersending() {
  const router = useRouter();
  const { uuid } = useUuid();
  const { setFocus } = useSetFocus();
  const { scrollIntoView } = useScrollIntoView();
  const { getAppText, getInfosideText } = useSanity();
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const ettersendingText = getInfosideText("ettersending.informasjon");
  const [ettersendSoknad, ettersendSoknadStatus] =
    usePutRequest<IEttersendBody>("soknad/ettersend");
  const { isBundling, dokumentkravWithBundleError, bundleDokumentkravList, noDocumentsToSave } =
    useDokumentkravBundler();
  const [generalError, setGeneralError] = useState(false);
  const { dokumentkravList, getDokumentkravList } = useDokumentkrav();

  const availableDokumentkravForEttersending: IDokumentkrav[] = dokumentkravList.krav.filter(
    (krav: IDokumentkrav): boolean =>
      krav.svar === DOKUMENTKRAV_SVAR_SEND_NAA || krav.svar === DOKUMENTKRAV_SVAR_SENDER_SENERE
  );

  const missingDokumentkrav: IDokumentkrav[] = availableDokumentkravForEttersending.filter(
    (krav: IDokumentkrav): boolean => krav.svar === DOKUMENTKRAV_SVAR_SENDER_SENERE
  );
  const receivedDokumentkrav: IDokumentkrav[] = availableDokumentkravForEttersending.filter(
    (krav: IDokumentkrav): boolean => krav.svar === DOKUMENTKRAV_SVAR_SEND_NAA && !!krav.bundleFilsti
  );

  const unavailableDokumentkravForEttersending: IDokumentkrav[] = dokumentkravList.krav.filter(
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
    setGeneralError(false);

    const newestDokumentkravList = await getDokumentkravList();

    if (!newestDokumentkravList) {
      setGeneralError(true);
      return;
    }

    const dokumentkravToBundle = newestDokumentkravList.krav.filter((krav) => {
      const hasUnbundledFiles = krav.filer.find((fil) => !fil.bundlet);
      if (hasUnbundledFiles) {
        return krav;
      }
    });

    const bundlingSuccessful = await bundleDokumentkravList(dokumentkravToBundle);

    if (bundlingSuccessful) {
      ettersendSoknad({ uuid });
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
              hasBundleError={
                !dokumentkravWithBundleError.findIndex(
                  (dokumentkrav) => dokumentkrav.id === krav.id
                )
              }
            />
          ))}

          {generalError && <ValidationMessage message={getAppText("ettersending.generell-feil")} />}

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
