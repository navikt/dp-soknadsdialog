import React, { useState } from "react";
import { Button, ConfirmationPanel, Heading } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useSession } from "../session.utils";
import { useSanity } from "../context/sanity-context";
import { PortableText } from "@portabletext/react";
import { Timeline as timeline } from "../components/timeline/Timeline";

export function StartSoknad() {
  const router = useRouter();
  const { session } = useSession({ enforceLogin: false });
  const [isCreatingSoknadUUID, setIsCreatingSoknadUUID] = useState(false);
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const { getAppTekst, getStartsideText } = useSanity();

  async function startSoknad() {
    setIsCreatingSoknadUUID(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/soknad/get-uuid`);
    const uuid = await response.text();

    router.push(`/${uuid}`);
  }

  function login() {
    if (session === undefined) {
      window.location.assign(`${router.basePath}/oauth2/login`);
    }
  }

  const startSideText = getStartsideText();
  const portableTextComponents = { types: { timeline } };

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
        onChange={() => setConsentGiven(!consentGiven)}
      >
        {getAppTekst("start-soknad.samtykke-innhenting-data.tekst")}
      </ConfirmationPanel>

      {session === undefined && (
        <Button variant="primary" size="medium" onClick={login}>
          logg inn først!
        </Button>
      )}
      <Button
        variant="primary"
        size="medium"
        onClick={startSoknad}
        loading={isCreatingSoknadUUID}
        disabled={!consentGiven}
      >
        {getAppTekst("start-soknad.start-knapp")}
      </Button>
    </main>
  );
}
