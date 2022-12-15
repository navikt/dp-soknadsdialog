import { Alert, Button, ConfirmationPanel, Link } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import api from "../../api.utils";
import { ErrorRetryModal } from "../../components/error-retry-modal/ErrorRetryModal";
import { NoSessionModal } from "../../components/no-session-modal/NoSessionModal";
import { PageMeta } from "../../components/PageMeta";
import { Timeline } from "../../components/sanity/timeline/Timeline";
import { ReadMore } from "../../components/sanity/readmore/ReadMore";
import { useSanity } from "../../context/sanity-context";
import { SoknadHeader } from "../../components/soknad-header/SoknadHeader";
import { ErrorTypesEnum } from "../../types/error.types";
import { useSetFocus } from "../../hooks/useSetFocus";
import styles from "./StartSoknad.module.css";

export function StartSoknad() {
  const router = useRouter();
  const { setFocus } = useSetFocus();
  const [isError, setIsError] = useState(false);
  const { getAppText, getInfosideText } = useSanity();
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const [isCreatingSoknadUUID, setIsCreatingSoknadUUID] = useState(false);
  const [showConsentValidation, setShowConsentValidation] = useState(false);
  const missingConsentRef = useRef<HTMLInputElement>(null);
  const startSideText = getInfosideText("startside");

  useEffect(() => {
    if (showConsentValidation) {
      setFocus(missingConsentRef);
    }
  }, [showConsentValidation]);

  async function startSoknad() {
    if (!consentGiven) {
      setShowConsentValidation(true);

      // If showConsentValidation is false, the async useEffect will trigger
      // a scroll as soon as the state is set (and the validation error element is in view)
      if (showConsentValidation) {
        setFocus(missingConsentRef);
      }

      return;
    }

    try {
      setIsCreatingSoknadUUID(true);
      const uuidResponse = await fetch(api("soknad/uuid"));

      if (uuidResponse.ok) {
        const uuid = await uuidResponse.text();
        router.push(`/soknad/${uuid}`);
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
    <>
      <PageMeta
        title={getAppText("arbeidssokerstatus.side-metadata.tittel")}
        description={getAppText("arbeidssokerstatus.side-metadata.meta-beskrivelse")}
      />
      <SoknadHeader />
      <main>
        {startSideText?.body && (
          <PortableText
            value={startSideText.body}
            components={{ types: { timeline: Timeline, readMore: ReadMore } }}
          />
        )}

        <ConfirmationPanel
          className="my-11"
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
          ref={missingConsentRef}
        />
        <Button
          variant="primary"
          size="medium"
          onClick={startSoknad}
          loading={isCreatingSoknadUUID}
        >
          {getAppText("start-soknad.knapp.start")}
        </Button>

        <NoSessionModal />
      </main>
    </>
  );
}
