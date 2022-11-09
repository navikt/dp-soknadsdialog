import React, { useEffect, useState } from "react";
import { IQuizSeksjon } from "../types/quiz.types";
import { Accordion, Alert, Button, ConfirmationPanel } from "@navikt/ds-react";
import { Faktum } from "../components/faktum/Faktum";
import { Left } from "@navikt/ds-icons";
import { useRouter } from "next/router";
import { useSanity } from "../context/sanity-context";
import { NoSessionModal } from "../components/no-session-modal/NoSessionModal";
import { ProgressBar } from "../components/progress-bar/ProgressBar";
import { PageMeta } from "../components/PageMeta";
import { useProgressBarSteps } from "../hooks/useProgressBarSteps";
import { useUuid } from "../hooks/useUuid";
import { usePutRequest } from "../hooks/usePutRequest";
import { useDeleteRequest } from "../hooks/useDeleteRequest";
import { SoknadHeader } from "../components/soknad-header/SoknadHeader";

interface IProps {
  sections: IQuizSeksjon[];
}

export function Summary(props: IProps) {
  const router = useRouter();
  const { uuid } = useUuid();
  const { getAppText, getSeksjonTextById } = useSanity();
  const { totalSteps, summaryStep } = useProgressBarSteps();

  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const [showConsentValidation, setShowConsentValidation] = useState(false);
  const [deleteSoknad, deleteSoknadStatus] = useDeleteRequest("soknad/delete");
  const [finishSoknad, finishSoknadStatus] = usePutRequest(
    `soknad/${uuid}/ferdigstill?locale=${router.locale}`
  );

  function validateAndCompleteSoknad() {
    if (!consentGiven) {
      setShowConsentValidation(true);
      return;
    }
    finishSoknad();
  }

  function navigateToDocumentation() {
    router.push(`/${router.query.uuid}/dokumentasjon`);
  }

  useEffect(() => {
    if (deleteSoknadStatus === "success") {
      window.location.assign("https://arbeid.dev.nav.no/arbeid/dagpenger/mine-dagpenger");
    }
  }, [deleteSoknadStatus]);

  useEffect(() => {
    if (finishSoknadStatus === "success") {
      router.push(`/${router.query.uuid}/kvittering`);
    }
  }, [finishSoknadStatus]);

  return (
    <main>
      <PageMeta
        title={getAppText("oppsummering.side-metadata.tittel")}
        description={getAppText("oppsummering.side-metadata.meta-beskrivelse")}
      />
      <SoknadHeader />
      <ProgressBar currentStep={summaryStep} totalSteps={totalSteps} />
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
                      as="a"
                      variant="secondary"
                      href={`${router.basePath}/${router.query.uuid}?seksjon=${index + 1}`}
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
        onChange={() => {
          setConsentGiven(!consentGiven);
          setShowConsentValidation(!showConsentValidation);
        }}
        error={
          showConsentValidation && !consentGiven
            ? getAppText("oppsummering.checkbox.samtykke-riktige-opplysninger.validering-tekst")
            : undefined
        }
      >
        {getAppText("oppsummering.checkbox.samtykke-riktige-opplysninger.tekst")}
      </ConfirmationPanel>

      <nav className="navigation-container">
        <Button variant={"secondary"} onClick={() => navigateToDocumentation()} icon={<Left />}>
          {getAppText("soknad.knapp.forrige-steg")}
        </Button>

        <Button onClick={validateAndCompleteSoknad} loading={finishSoknadStatus === "pending"}>
          {getAppText("oppsummering.knapp.send-soknad")}
        </Button>

        <Button
          variant={"secondary"}
          onClick={() => deleteSoknad(uuid)}
          loading={deleteSoknadStatus === "pending"}
        >
          {getAppText("oppsummering.knapp.slett-soknad")}
        </Button>
      </nav>

      {deleteSoknadStatus === "error" && (
        <div className="my-8">
          <Alert variant={"error"}> {getAppText("oppsummering.feilmelding.slett-soknad")} </Alert>
        </div>
      )}

      {finishSoknadStatus === "error" && (
        <div className="my-8">
          <Alert variant={"error"}>
            {getAppText("oppsummering.feilmelding.ferdigstill-soknad")}{" "}
          </Alert>
        </div>
      )}
      <NoSessionModal />
    </main>
  );
}
