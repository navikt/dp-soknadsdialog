import React, { useEffect, useRef, useState } from "react";
import { IDokumentkravList } from "../../types/documentation.types";
import { EttersendingDokumentkravSendingItem } from "./EttersendingDokumentkravSendingItem";
import { Button, ErrorSummary, Heading } from "@navikt/ds-react";
import { useScrollIntoView } from "../../hooks/useScrollIntoView";
import { useEttersending } from "../../hooks/dokumentkrav/useEttersending";
import { useRouter } from "next/router";
import { usePutRequest } from "../../hooks/usePutRequest";
import { useUuid } from "../../hooks/useUuid";
import { useSetFocus } from "../../hooks/useSetFocus";
import { useSanity } from "../../context/sanity-context";
import { DokumentkravTitle } from "../../components/dokumentkrav/DokumentkravTitle";
import {
  ETTERSENDING_DOKUMENTER_INNSENDING_TITTEL,
  ETTERSENDING_INFORMASJON,
  ETTERSENDING_KNAPP_AVBRYT,
  ETTERSENDING_KNAPP_SEND_INN_DOKUMENTER,
  ETTERSENDING_TITTEL,
  ETTERSENDING_VALIDERING_INGEN_DOKUMENTER,
} from "../../text-constants";
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
import styles from "../receipt/Receipts.module.css";
import { ValidationMessage } from "../../components/faktum/validation/ValidationMessage";

interface IProps {
  dokumentkrav: IDokumentkravList;
}

export function Ettersending(props: IProps) {
  const router = useRouter();
  const { uuid } = useUuid();
  const { setFocus } = useSetFocus();
  const { getAppText, getInfosideText } = useSanity();
  const { scrollIntoView } = useScrollIntoView();
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const ettersendingText = getInfosideText(ETTERSENDING_INFORMASJON);
  const [bundlingComplete, setBundlingComplete] = useState(false);
  const [noDocumentsToSave, setNoDocumentsToSave] = useState(false);
  const [ettersendSoknad, ettersendSoknadStatus] = usePutRequest(`soknad/${uuid}/ettersend`);
  const {
    dokumentkravToBundleAndSave,
    addDokumentkravToBundleAndSave,
    removeDokumentkravToBundleAndSave,
    dokumentkravWithError,
    bundleAndSaveDokumentkrav,
  } = useEttersending();

  const availableDokumentkravForEttersending = props.dokumentkrav.krav.filter(
    (krav) =>
      krav.svar === DOKUMENTKRAV_SVAR_SEND_NAA || krav.svar === DOKUMENTKRAV_SVAR_SENDER_SENERE
  );

  const unavailableDokumentkravForEttersending = props.dokumentkrav.krav.filter(
    (krav) =>
      krav.svar === DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE ||
      krav.svar === DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE ||
      krav.svar === DOKUMENTKRAV_SVAR_SENDER_IKKE
  );

  useEffect(() => {
    if (dokumentkravToBundleAndSave.length > 0 && noDocumentsToSave) {
      setNoDocumentsToSave(false);
    }
  }, [dokumentkravToBundleAndSave.length]);

  useEffect(() => {
    if (dokumentkravWithError.length > 0) {
      scrollIntoView(errorSummaryRef);
      setFocus(errorSummaryRef);
    }
  }, [dokumentkravWithError.length]);

  useEffect(() => {
    if (bundlingComplete && dokumentkravWithError.length === 0) {
      ettersendSoknad();
    }
  }, [dokumentkravWithError.length, bundlingComplete]);

  useEffect(() => {
    if (ettersendSoknadStatus === "success") {
      router.push(`/${uuid}/kvittering`);
    }
  }, [ettersendSoknadStatus]);

  async function bundleAndSaveAllDokumentkrav() {
    if (dokumentkravToBundleAndSave.length === 0) {
      setNoDocumentsToSave(true);
      return;
    }

    if (noDocumentsToSave) {
      setNoDocumentsToSave(false);
    }

    if (bundlingComplete) {
      setBundlingComplete(false);
    }

    for (const dokumentkrav of dokumentkravToBundleAndSave) {
      await bundleAndSaveDokumentkrav(dokumentkrav);
    }

    setBundlingComplete(true);
  }

  return (
    <div>
      <SoknadHeader titleTextKey={ETTERSENDING_TITTEL} />

      {dokumentkravWithError.length > 0 && (
        <ErrorSummary
          size="medium"
          ref={errorSummaryRef}
          heading={getAppText("ettersending.feilmelding.oppsummering.tittel")}
        >
          {dokumentkravWithError.map((krav) => (
            <ErrorSummary.Item key={krav.id} href={`#${krav.id}`}>
              <DokumentkravTitle dokumentkrav={krav} />
            </ErrorSummary.Item>
          ))}
        </ErrorSummary>
      )}

      {ettersendingText && (
        <div className={styles.dokumentasjonsTextContainer}>
          <PortableText value={ettersendingText.body} />
        </div>
      )}

      {availableDokumentkravForEttersending.length > 0 && (
        <>
          <Heading level="2" size="medium" className="my-6">
            {getAppText(ETTERSENDING_DOKUMENTER_INNSENDING_TITTEL)}
          </Heading>

          {availableDokumentkravForEttersending.map((krav) => (
            <EttersendingDokumentkravSendingItem
              key={krav.id}
              dokumentkrav={krav}
              addDokumentkrav={addDokumentkravToBundleAndSave}
              removeDokumentkrav={removeDokumentkravToBundleAndSave}
            />
          ))}

          {noDocumentsToSave && (
            <ValidationMessage message={getAppText(ETTERSENDING_VALIDERING_INGEN_DOKUMENTER)} />
          )}

          <div className="navigation-container">
            <Button variant="primary" onClick={bundleAndSaveAllDokumentkrav}>
              {getAppText(ETTERSENDING_KNAPP_SEND_INN_DOKUMENTER)}
            </Button>

            <Link href={`/${uuid}/kvittering`} passHref>
              <Button as="a" variant="secondary">
                {getAppText(ETTERSENDING_KNAPP_AVBRYT)}
              </Button>
            </Link>
          </div>
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
