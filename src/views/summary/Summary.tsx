import { Left } from "@navikt/ds-icons";
import { Accordion, Alert, Button, ConfirmationPanel, Tag } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { ExitSoknad } from "../../components/exit-soknad/ExitSoknad";
import { Faktum } from "../../components/faktum/Faktum";
import { NoSessionModal } from "../../components/no-session-modal/NoSessionModal";
import { ProgressBar } from "../../components/progress-bar/ProgressBar";
import { PageMeta } from "../../components/PageMeta";
import { useProgressBarSteps } from "../../hooks/useProgressBarSteps";
import { useUuid } from "../../hooks/useUuid";
import { usePutRequest } from "../../hooks/usePutRequest";
import { SoknadHeader } from "../../components/soknad-header/SoknadHeader";
import { useSanity } from "../../context/sanity-context";
import Link from "next/link";
import { useSetFocus } from "../../hooks/useSetFocus";
import styles from "./Summary.module.css";
import { useQuiz } from "../../context/quiz-context";
import { SectionHeading } from "../../components/section/SectionHeading";
import { IPersonalia } from "../../types/personalia.types";
import { Personalia } from "../../components/personalia/Personalia";

interface IProps {
  personalia: IPersonalia | null;
}

export function Summary(props: IProps) {
  const { personalia } = props;

  const router = useRouter();
  const { uuid } = useUuid();
  const { soknadState } = useQuiz();
  const { getAppText, getSeksjonTextById } = useSanity();
  const { totalSteps, summaryStep } = useProgressBarSteps();
  const { setFocus } = useSetFocus();

  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const [showConsentValidation, setShowConsentValidation] = useState(false);
  const [showSoknadNotCompleteError, setshowSoknadNotCompleteError] = useState(false);
  const soknadCompleteErrorRef = useRef<HTMLDivElement>(null);

  const textId = "oppsummering";
  const summarySectionText = getSeksjonTextById(textId);
  const textPersonaliaId = "personalia";
  const personaliaTexts = getSeksjonTextById(textPersonaliaId);

  const [finishSoknad, finishSoknadStatus] = usePutRequest(
    `soknad/${uuid}/ferdigstill?locale=${router.locale}`
  );

  useEffect(() => {
    if (showSoknadNotCompleteError) {
      setFocus(soknadCompleteErrorRef);
    }
  }, [showSoknadNotCompleteError]);

  function validateAndCompleteSoknad() {
    if (!consentGiven) {
      setShowConsentValidation(true);
      return;
    }
    if (!soknadState.ferdig) {
      setshowSoknadNotCompleteError(true);

      // If showValidationErrors is false, the async useEffect will trigger
      // a scroll as soon as the state is set (and the validation error element is in view)
      if (showSoknadNotCompleteError) {
        setFocus(soknadCompleteErrorRef);
      }

      return;
    }

    finishSoknad();
  }

  function navigateToDocumentation() {
    router.push(`/soknad/${router.query.uuid}/dokumentasjon`);
  }

  useEffect(() => {
    if (finishSoknadStatus === "success") {
      router.push(`/soknad/${router.query.uuid}/kvittering`);
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

      <SectionHeading text={summarySectionText} fallback={textId} />

      <Accordion>
        {personalia && (
          <Accordion.Item>
            <Accordion.Header>
              {personaliaTexts?.title ? personaliaTexts.title : textPersonaliaId}
            </Accordion.Header>
            <Accordion.Content>
              <Personalia personalia={personalia} mode="summary" />
            </Accordion.Content>
          </Accordion.Item>
        )}
        {soknadState.seksjoner?.map((section, index) => {
          const sectionTexts = getSeksjonTextById(section.beskrivendeId);
          return (
            <Accordion.Item key={section.beskrivendeId}>
              <Accordion.Header>
                {sectionTexts?.title ? sectionTexts?.title : section.beskrivendeId}

                {showSoknadNotCompleteError && !section.ferdig && (
                  <Tag variant="error" className={styles.notCompleteTag}>
                    {getAppText("oppsummering.seksjon.ikke-ferdig-tag")}
                  </Tag>
                )}
              </Accordion.Header>
              <Accordion.Content>
                <>
                  {section.fakta.map((faktum) => {
                    return <Faktum key={faktum.id} faktum={faktum} readonly={true} />;
                  })}

                  <Link href={`/soknad/${uuid}?seksjon=${index + 1}`} passHref>
                    <Button variant="primary" as="a">
                      {getAppText("oppsummering.knapp.endre-svar")}
                    </Button>
                  </Link>
                </>
              </Accordion.Content>
            </Accordion.Item>
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

      {showSoknadNotCompleteError && (
        <Alert tabIndex={-1} variant="error" ref={soknadCompleteErrorRef}>
          {getAppText("oppsummering.feilmelding.soknad-ikke-ferdig-utfylt")}
        </Alert>
      )}

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
