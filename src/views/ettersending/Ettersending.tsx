import React, { useEffect, useRef, useState } from "react";
import { IDokumentkravList } from "../../types/documentation.types";
import { EttersendingDokumentkrav } from "./EttersendingDokumentkrav";
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
  ETTERSENDING_TITTEL,
} from "../../text-constants";
import styles from "../receipt/Receipts.module.css";
import { PortableText } from "@portabletext/react";
import { SoknadHeader } from "../../components/soknad-header/SoknadHeader";

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
  const [ettersendSoknad, ettersendSoknadStatus] = usePutRequest(`soknad/${uuid}/ettersend`);

  const {
    dokumentkravToBundleAndSave,
    addDokumentkravToBundleAndSave,
    dokumentkravWithError,
    bundleAndSaveDokumentkrav,
  } = useEttersending();

  async function bundleAndSaveAllDokumentkrav() {
    if (bundlingComplete) {
      setBundlingComplete(false);
    }

    for (const dokumentkrav of dokumentkravToBundleAndSave) {
      await bundleAndSaveDokumentkrav(dokumentkrav);
    }

    setBundlingComplete(true);
  }

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

      <Heading level="2" size="medium" className="my-6">
        {getAppText(ETTERSENDING_DOKUMENTER_INNSENDING_TITTEL)}
      </Heading>

      {props.dokumentkrav.krav.map((krav) => (
        <EttersendingDokumentkrav
          key={krav.id}
          dokumentkrav={krav}
          updateDokumentkrav={addDokumentkravToBundleAndSave}
        />
      ))}

      <Button variant="primary" onClick={bundleAndSaveAllDokumentkrav}>
        Send inn
      </Button>
    </div>
  );
}
