import { Left } from "@navikt/ds-icons";
import { Accordion, Alert, Button, ConfirmationPanel, Tag } from "@navikt/ds-react";
import Link from "next/link";
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
import { useSetFocus } from "../../hooks/useSetFocus";
import { IFerdigstillBody } from "../../pages/api/soknad/ferdigstill";
import { Locale } from "@navikt/nav-dekoratoren-moduler/ssr";
import { useQuiz } from "../../context/quiz-context";
import { SectionHeading } from "../../components/section/SectionHeading";
import { IPersonalia } from "../../types/personalia.types";
import { Personalia } from "../../components/personalia/Personalia";
import styles from "./Summary.module.css";
import { trackSkjemaFullført } from "../../amplitude.tracking";
import { SummaryDokumentkrav } from "../../components/summary-dokumentkrav/SummaryDokumentkrav";
import { useDokumentkrav } from "../../context/dokumentkrav-context";
import { DOKUMENTKRAV_SVAR_SEND_NAA } from "../../constants";
interface IProps {
  personalia: IPersonalia | null;
}

export function Summary(props: IProps) {
  const { personalia } = props;
  const { dokumentkravList, getFirstUnansweredDokumentkrav } = useDokumentkrav();

  const router = useRouter();
  const { uuid } = useUuid();
  const { soknadState } = useQuiz();
  const { getAppText, getSeksjonTextById } = useSanity();
  const { totalSteps, summaryStep } = useProgressBarSteps();
  const { setFocus } = useSetFocus();

  const [consentGiven, setConsentGiven] = useState(false);
  const consentRef = useRef(null);
  const [navigating, setIsNavigating] = useState(false);
  const [showConsentValidation, setShowConsentValidation] = useState(false);
  const [showSoknadNotCompleteError, setshowSoknadNotCompleteError] = useState(false);
  const [finishSoknad, finishSoknadStatus] = usePutRequest<IFerdigstillBody>(`soknad/ferdigstill`);

  const soknadCompleteErrorRef = useRef<HTMLDivElement>(null);
  const textId = "oppsummering";
  const textPersonaliaId = "personalia";
  const textDokumentkravId = "oppsummering.seksjon.dokumentkrav";
  const summarySectionText = getSeksjonTextById(textId);
  const personaliaTexts = getSeksjonTextById(textPersonaliaId);

  const dokumentkravWithoutBundle = dokumentkravList.krav.filter((krav) => {
    return krav.svar === DOKUMENTKRAV_SVAR_SEND_NAA && !krav.bundleFilsti;
  });
  const invalidDokumentkrav =
    getFirstUnansweredDokumentkrav() || dokumentkravWithoutBundle.length > 0;

  useEffect(() => {
    if (showSoknadNotCompleteError) {
      setFocus(soknadCompleteErrorRef);
    }
  }, [showSoknadNotCompleteError]);

  function validateAndCompleteSoknad() {
    if (!consentGiven) {
      setShowConsentValidation(true);
      setFocus(consentRef);
      return;
    }
    if (!soknadState.ferdig || invalidDokumentkrav) {
      setshowSoknadNotCompleteError(true);

      // If showValidationErrors is false, the async useEffect will trigger
      // a scroll as soon as the state is set (and the validation error element is in view)
      if (showSoknadNotCompleteError) {
        setFocus(soknadCompleteErrorRef);
      }

      return;
    }

    const locale = router.locale as Locale | undefined;
    trackSkjemaFullført("dagpenger", uuid);
    finishSoknad({ uuid, locale });
  }

  function navigateToPreviousStep() {
    setIsNavigating(true);
    if (dokumentkravList.krav.length > 0) {
      router.push(`/soknad/${router.query.uuid}/dokumentasjon`);
    } else {
      router.push(`/soknad/${router.query.uuid}?seksjon=${soknadState.seksjoner.length}`);
    }
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

                {!section.ferdig && (
                  <Tag variant="error" className={styles.notCompleteTag}>
                    {getAppText("oppsummering.seksjon.ikke-ferdig-tag")}
                  </Tag>
                )}
              </Accordion.Header>
              <Accordion.Content>
                <>
                  {section.fakta.map((faktum) => (
                    <Faktum key={faktum.id} faktum={faktum} readonly={true} />
                  ))}

                  <Link href={`/soknad/${uuid}?seksjon=${index + 1}`} passHref legacyBehavior>
                    <Button variant="primary" as="a">
                      {getAppText("oppsummering.knapp.endre-svar")}
                    </Button>
                  </Link>
                </>
              </Accordion.Content>
            </Accordion.Item>
          );
        })}

        {dokumentkravList && dokumentkravList.krav.length > 0 && (
          <Accordion.Item>
            <Accordion.Header>
              {getAppText(textDokumentkravId)}{" "}
              {invalidDokumentkrav && (
                <Tag variant="error" className={styles.notCompleteTag}>
                  {getAppText("oppsummering.seksjon.ikke-ferdig-tag")}
                </Tag>
              )}
            </Accordion.Header>
            <Accordion.Content>
              <>
                <ul className={styles.dokumentkravList}>
                  {dokumentkravList.krav.map((krav) => (
                    <SummaryDokumentkrav dokumentkrav={krav} key={krav.id} />
                  ))}
                </ul>
                <Link href={`/soknad/${uuid}/dokumentasjon`} passHref legacyBehavior>
                  <Button variant="primary" as="a">
                    {getAppText("oppsummering.knapp.endre-svar")}
                  </Button>
                </Link>
              </>
            </Accordion.Content>
          </Accordion.Item>
        )}
      </Accordion>

      <ConfirmationPanel
        ref={consentRef}
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
        <Button
          variant={"secondary"}
          onClick={() => navigateToPreviousStep()}
          icon={<Left />}
          loading={navigating}
        >
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
            {getAppText("oppsummering.feilmelding.ferdigstill-soknad")}
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
