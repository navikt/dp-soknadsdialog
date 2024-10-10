import { Button, ConfirmationPanel } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import api from "../../utils/api.utils";
import { ErrorRetryModal } from "../../components/error-retry-modal/ErrorRetryModal";
import { PageMeta } from "../../components/PageMeta";
import { ReadMore } from "../../components/sanity/readmore/ReadMore";
import { Timeline } from "../../components/sanity/timeline/Timeline";
import { SoknadHeader } from "../../components/soknad-header/SoknadHeader";
import { useSanity } from "../../context/sanity-context";
import { useSetFocus } from "../../hooks/useSetFocus";
import { ErrorTypesEnum } from "../../types/error.types";
import { trackSkjemaStartet } from "../../amplitude.tracking";
import { logger } from "@navikt/next-logger";
import { useFeatureToggles } from "../../context/feature-toggle-context";

export function StartSoknad() {
  const router = useRouter();
  const { setFocus } = useSetFocus();
  const { soknadsdialogMedOrkestratorIsEnabled } = useFeatureToggles();
  const [isError, setIsError] = useState(false);
  const { getAppText, getInfosideText } = useSanity();
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
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

    if (!soknadsdialogMedOrkestratorIsEnabled) {
      try {
        setIsLoading(true);
        const uuidResponse = await fetch(api("soknad/uuid"));

        if (uuidResponse.ok) {
          const uuid = await uuidResponse.text();
          trackSkjemaStartet("dagpenger", uuid);
          router.push(`/soknad/${uuid}`);
        } else {
          throw new Error(uuidResponse.statusText);
        }
      } catch (error) {
        logger.error(error, "StartSoknad: Error creating UUID");
        setIsError(true);
      }
    }

    if (soknadsdialogMedOrkestratorIsEnabled) {
      try {
        setIsLoading(true);
        const soknadIdResponse = await fetch(api("orkestrator/start"));

        if (soknadIdResponse.ok) {
          const uuid = await soknadIdResponse.json();

          trackSkjemaStartet("dagpenger", uuid);
          router.push(`/soknad/${uuid}`);
        } else {
          throw new Error(soknadIdResponse.statusText);
        }
      } catch (error) {
        logger.error(error, "StartSoknad: Error creating UUID");
        setIsError(true);
      }
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
      <main id="maincontent" tabIndex={-1}>
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
        <Button variant="primary" size="medium" onClick={startSoknad} loading={isLoading}>
          {getAppText("start-soknad.knapp.start")}
        </Button>
      </main>
    </>
  );
}
