import { Alert, Button, ConfirmationPanel, Heading, Link } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { useRouter } from "next/router";
import { useState } from "react";
import api from "../../api.utils";
import { ErrorRetryModal } from "../../components/error-retry-modal/ErrorRetryModal";
import { NoSessionModal } from "../../components/no-session-modal/NoSessionModal";
import { Timeline as timeline } from "../../components/timeline/Timeline";
import { useSanity } from "../../context/sanity-context";
import { ErrorTypesEnum } from "../../types/error.types";
import styles from "./StartSoknad.module.css";

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

      <Alert variant="info" className={styles.newSoknadAlertText}>
        {getAppText("start-soknad.ny-soknad-info.start-tekst")}{" "}
        <Link href="https://www.nav.no/arbeid/dagpenger/soknad-veileder">
          {getAppText("start-soknad.ny-soknad-info.lenke-tekst")}
        </Link>{" "}
        {getAppText("start-soknad.ny-soknad-info.slutt-tekst")}
      </Alert>

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
