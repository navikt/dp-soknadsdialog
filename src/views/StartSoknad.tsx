import React, { useState } from "react";
import { Button, ConfirmationPanel, Heading } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useSession } from "../session.utils";
import { useSanity } from "../context/sanity-context";
import { PortableText } from "@portabletext/react";
import { Timeline as timeline } from "../components/timeline/Timeline";
import { ErrorRetryModal } from "../components/error-retry-modal/ErrorRetryModal";
import { ErrorTypesEnum } from "../types/error.types";
import { NoSessionModal } from "../components/no-session-modal/NoSessionModal";
import { getUuid } from "../api/getUuid-api";

export function StartSoknad() {
  const router = useRouter();
  const { session } = useSession({ enforceLogin: false });
  const [isCreatingSoknadUUID, setIsCreatingSoknadUUID] = useState(false);
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const [showConsentValidation, setShowConsentValidation] = useState(false);
  const [isError, setIsError] = useState(false);
  const { getAppTekst, getInfosideText } = useSanity();

  async function startSoknad() {
    if (!consentGiven) {
      setShowConsentValidation(true);
      return;
    }

    try {
      setIsCreatingSoknadUUID(true);
      const uuid = await getUuid();
      router.push(`/${uuid}`);
    } catch (e) {
      setIsError(true);
    }
  }

  function login() {
    if (session === undefined) {
      window.location.assign(`${router.basePath}/oauth2/login`);
    }
  }

  const startSideText = getInfosideText("startside");
  const portableTextComponents = { types: { timeline } };

  if (isError) {
    return <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />;
  }

  return (
    <main>
      <Heading spacing size="xlarge" level="1">
        {getAppTekst("start-soknad.tittel")}
      </Heading>

      {startSideText?.body && (
        <PortableText value={startSideText.body} components={portableTextComponents} />
      )}

      <ConfirmationPanel
        className="confirmation-panel"
        checked={consentGiven}
        label={getAppTekst("start-soknad.samtykke-innhenting-data.checkbox-label")}
        onChange={() => {
          setConsentGiven(!consentGiven);
          setShowConsentValidation(!showConsentValidation);
        }}
        error={
          showConsentValidation
            ? getAppTekst("start-soknad.samtykke-innhenting-data.validering-tekst")
            : false
        }
      />

      {session === undefined && (
        <Button variant="primary" size="medium" onClick={login}>
          logg inn først!
        </Button>
      )}
      <Button variant="primary" size="medium" onClick={startSoknad} loading={isCreatingSoknadUUID}>
        {getAppTekst("start-soknad.start-knapp")}
      </Button>

      <NoSessionModal />
    </main>
  );
}
