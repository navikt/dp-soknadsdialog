import { Left } from "@navikt/ds-icons";
import { Accordion, Alert, Button, ConfirmationPanel } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ExitSoknad } from "../components/exit-soknad/ExitSoknad";
import { Faktum } from "../components/faktum/Faktum";
import { NoSessionModal } from "../components/no-session-modal/NoSessionModal";
import { PageMeta } from "../components/PageMeta";
import { ProgressBar } from "../components/ProgressBar";
import { useSanity } from "../context/sanity-context";
import { useNumberOfSoknadSteps } from "../hooks/useNumberOfSoknadSteps";
import { usePutRequest } from "../hooks/usePutRequest";
import { useUuid } from "../hooks/useUuid";
import { IQuizSeksjon } from "../types/quiz.types";

interface IProps {
  sections: IQuizSeksjon[];
}

export function Summary(props: IProps) {
  const router = useRouter();
  const { uuid } = useUuid();
  const { getAppText, getSeksjonTextById } = useSanity();
  const { numberOfSoknadSteps } = useNumberOfSoknadSteps();

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
      </nav>

      {finishSoknadStatus === "error" && (
        <div className="my-8">
          <Alert variant={"error"}>
            {getAppText("oppsummering.feilmelding.ferdigstill-soknad")}{" "}
          </Alert>
        </div>
      )}
      <div className="my-6">
        <ExitSoknad />
      </div>
      <NoSessionModal />
    </>
  );
}
