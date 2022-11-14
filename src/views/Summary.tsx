import { Left } from "@navikt/ds-icons";
import { Accordion, Alert, Button, ConfirmationPanel } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ExitSoknad } from "../components/exit-soknad/ExitSoknad";
import { Faktum } from "../components/faktum/Faktum";
import { NoSessionModal } from "../components/no-session-modal/NoSessionModal";
import { IQuizSeksjon } from "../types/quiz.types";
import { ProgressBar } from "../components/progress-bar/ProgressBar";
import { PageMeta } from "../components/PageMeta";
import { useProgressBarSteps } from "../hooks/useProgressBarSteps";
import { useUuid } from "../hooks/useUuid";
import { usePutRequest } from "../hooks/usePutRequest";
import { SoknadHeader } from "../components/soknad-header/SoknadHeader";
import { useSanity } from "../context/sanity-context";

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
        className="my-11"
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

        <Button
          onClick={validateAndCompleteSoknad}
          loading={finishSoknadStatus === "pending"}
          disabled={finishSoknadStatus === "success"}
        >
          {getAppText("oppsummering.knapp.send-soknad")}
        </Button>
      </nav>

      {finishSoknadStatus === "error" && (
        <div className="my-11">
          <Alert variant={"error"}>
            {getAppText("oppsummering.feilmelding.ferdigstill-soknad")}{" "}
          </Alert>
        </div>
      )}
      <div className="my-6">
        <ExitSoknad />
      </div>
      <NoSessionModal />
    </main>
  );
}
