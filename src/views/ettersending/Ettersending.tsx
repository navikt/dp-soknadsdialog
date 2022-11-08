import React, { useEffect, useRef, useState } from "react";
import { IDokumentkravList } from "../../types/documentation.types";
import { EttersendingDokumentkrav } from "./EttersendingDokumentkrav";
import { Button, ErrorSummary } from "@navikt/ds-react";
import { useScrollIntoView } from "../../hooks/useScrollIntoView";
import { useEttersending } from "../../hooks/dokumentkrav/useEttersending";
import { useRouter } from "next/router";
import { usePutRequest } from "../../hooks/usePutRequest";
import { useUuid } from "../../hooks/useUuid";
import { useSetFocus } from "../../hooks/useSetFocus";
import { useSanity } from "../../context/sanity-context";
import { DokumentkravTitle } from "../../components/dokumentkrav/DokumentkravTitle";

interface IProps {
  dokumentkrav: IDokumentkravList;
}

export function Ettersending(props: IProps) {
  const router = useRouter();
  const { uuid } = useUuid();
  const { setFocus } = useSetFocus();
  const { getAppText } = useSanity();
  const { scrollIntoView } = useScrollIntoView();
  const errorSummaryRef = useRef<HTMLDivElement>(null);
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
