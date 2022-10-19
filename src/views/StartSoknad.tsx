import React, { useState } from "react";
import { Button, ConfirmationPanel, Heading } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useSanity } from "../context/sanity-context";
import { PortableText } from "@portabletext/react";
import { Timeline as timeline } from "../components/timeline/Timeline";
import { ErrorRetryModal } from "../components/error-retry-modal/ErrorRetryModal";
import { ErrorTypesEnum } from "../types/error.types";
import { NoSessionModal } from "../components/no-session-modal/NoSessionModal";
import api from "../api.utils";

export function StartSoknad() {
  const router = useRouter();
  const [isError, setIsError] = useState(false);
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const [isCreatingSoknadUUID, setIsCreatingSoknadUUID] = useState(false);
  const [showConsentValidation, setShowConsentValidation] = useState(false);
  const { getAppText, getInfosideText } = useSanity();
  const startSideText = getInfosideText("startside");

  async function startSoknad() {
    if (!consentGiven) {
      setShowConsentValidation(true);
      return;
    }

    try {
      setIsCreatingSoknadUUID(true);
      const uuidResponse = await fetch(api("soknad/get-uuid"));

      if (uuidResponse.ok) {
        const uuid = await uuidResponse.text();
        router.push(`/${uuid}`);
      } else {
        throw new Error(uuidResponse.statusText);
      }
    } catch (error) {
      // TODO Sentry log
      // eslint-disable-next-line no-console
      console.error(error);
      setIsError(true);
    }
  }

  if (isError) {
    return <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />;
  }

  return (
    <main>
      <Heading spacing size="xlarge" level="1">
        {getAppText("start-soknad.tittel")}
      </Heading>

      {startSideText?.body && (
        <PortableText value={startSideText.body} components={{ types: { timeline } }} />
      )}

      <ConfirmationPanel
        className="confirmation-panel"
        checked={consentGiven}
        label={getAppText("start-soknad.checkbox.samtykke-riktige-opplysninger.label")}
        onChange={() => {
          setConsentGiven(!consentGiven);
          setShowConsentValidation(!showConsentValidation);
        }}
        error={
          showConsentValidation && !consentGiven
            ? getAppText("start-soknad.checkbox.samtykke-innhenting-data.validering-tekst")
            : undefined
        }
      />

      <Button variant="primary" size="medium" onClick={startSoknad} loading={isCreatingSoknadUUID}>
        {getAppText("start-soknad.knapp.start")}
      </Button>

      <NoSessionModal />
    </main>
  );
}
