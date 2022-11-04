import React, { useEffect, useState } from "react";
import { IQuizSeksjon } from "../types/quiz.types";
import { Accordion, Alert, Button, ConfirmationPanel } from "@navikt/ds-react";
import { Faktum } from "../components/faktum/Faktum";
import { Left } from "@navikt/ds-icons";
import { useRouter } from "next/router";
import { useSanity } from "../context/sanity-context";
import { ErrorRetryModal } from "../components/error-retry-modal/ErrorRetryModal";
import { ErrorTypesEnum } from "../types/error.types";
import { NoSessionModal } from "../components/no-session-modal/NoSessionModal";
import { ProgressBar } from "../components/ProgressBar";
import api from "../api.utils";
import { PageMeta } from "../components/PageMeta";
import { useNumberOfSoknadSteps } from "../hooks/useNumberOfSoknadSteps";
import { useAsync } from "../hooks/useAsync";
import { deleteSoknad } from "../api/deleteSoknad-api";
import { useUuid } from "../hooks/useUuid";

interface IProps {
  sections: IQuizSeksjon[];
}

export function Summary(props: IProps) {
  const router = useRouter();
  const { uuid } = useUuid();
  const deleteSoknadAsync = useAsync(() => deleteSoknad(uuid));
  const [hasError, setHasError] = useState(false);
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const { numberOfSoknadSteps } = useNumberOfSoknadSteps();
  const { getAppText, getSeksjonTextById } = useSanity();

  function goToDocumentation() {
    router.push(`/${router.query.uuid}/dokumentasjon`);
  }

  useEffect(() => {
    if (deleteSoknadAsync.status === "success") {
      window.location.assign("https://arbeid.dev.nav.no/arbeid/dagpenger/mine-dagpenger");
    }
  }, [deleteSoknadAsync.status]);

  async function finishSoknad() {
    try {
      const res = await fetch(api(`/soknad/${router.query.uuid}/complete?locale=${router.locale}`));

      if (!res.ok) {
        throw new Error(res.statusText);
      }
      router.push(`/${router.query.uuid}/kvittering`);
    } catch (error) {
      setHasError(true);
    }
  }

  if (hasError) {
    return <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />;
  }

  return (
    <>
      <PageMeta
        title={getAppText("oppsummering.side-metadata.tittel")}
        description={getAppText("oppsummering.side-metadata.meta-beskrivelse")}
      />
      <ProgressBar currentStep={13} totalSteps={numberOfSoknadSteps} />
      <Accordion>
        {props.sections?.map((section, index) => {
          return (
            <div key={section.beskrivendeId}>
              <Accordion.Item key={section.beskrivendeId}>
                <Accordion.Header>
                  {getSeksjonTextById(section.beskrivendeId)?.title}
                </Accordion.Header>
                <Accordion.Content>
                  <>
                    {section.fakta.map((faktum) => {
                      return <Faktum key={faktum.id} faktum={faktum} readonly={true} />;
                    })}

                    <Button
                      variant="secondary"
                      onClick={() => router.push(`/${router.query.uuid}?seksjon=${index + 1}`)}
                    >
                      {getAppText("oppsummering.knapp.endre-svar")}
                    </Button>
                  </>
                </Accordion.Content>
              </Accordion.Item>
            </div>
          );
        })}
      </Accordion>

      <ConfirmationPanel
        className="my-8"
        checked={consentGiven}
        label={getAppText("oppsummering.checkbox.samtykke-riktige-opplysninger.label")}
        onChange={() => setConsentGiven(!consentGiven)}
      >
        {getAppText("oppsummering.checkbox.samtykke-riktige-opplysninger.tekst")}
      </ConfirmationPanel>

      <nav className="navigation-container">
        <Button variant={"secondary"} onClick={() => goToDocumentation()} icon={<Left />}>
          {getAppText("soknad.knapp.forrige-steg")}
        </Button>

        <Button onClick={() => finishSoknad()} disabled={!consentGiven}>
          {getAppText("oppsummering.knapp.send-soknad")}
        </Button>

        <Button
          variant={"secondary"}
          onClick={deleteSoknadAsync.execute}
          loading={deleteSoknadAsync.status === "pending"}
        >
          {getAppText("oppsummering.knapp.slett-soknad")}
        </Button>
      </nav>

      {deleteSoknadAsync.status === "error" && (
        <div className="my-8">
          <Alert variant={"error"}> {getAppText("oppsummering.feilmelding.slett-soknad")} </Alert>
        </div>
      )}
      <NoSessionModal />
    </>
  );
}
