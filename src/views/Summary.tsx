import React, { useState } from "react";
import { IQuizSeksjon } from "../types/quiz.types";
import { Accordion, Button, ConfirmationPanel } from "@navikt/ds-react";
import { Faktum } from "../components/faktum/Faktum";
import { Left } from "@navikt/ds-icons";
import { useRouter } from "next/router";
import { useSanity } from "../context/sanity-context";
import { ErrorRetryModal } from "../components/error-retry-modal/ErrorRetryModal";
import { ErrorTypesEnum } from "../types/error.types";
import { NoSessionModal } from "../components/no-session-modal/NoSessionModal";
import { getKvittering } from "../api/getKvittering-api";

interface IProps {
  sections: IQuizSeksjon[];
}

export function Summary(props: IProps) {
  const [hasError, setHasError] = useState(false);
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const router = useRouter();
  const { getAppTekst, getSeksjonTextById } = useSanity();

  function goToDocumentation() {
    router.push(`/${router.query.uuid}/dokumentasjon`);
  }

  function cancelSoknad() {
    router.push(`/`);
  }

  function finishSoknad() {
    try {
      getKvittering(router.query.uuid, router.locale);
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
                      {getAppTekst("oppsummering.endre-svar")}
                    </Button>
                  </>
                </Accordion.Content>
              </Accordion.Item>
            </div>
          );
        })}
      </Accordion>

      <ConfirmationPanel
        className="confirmation-panel"
        checked={consentGiven}
        label={getAppTekst("oppsummering.samtykke-riktige-opplysninger.checkbox-label")}
        onChange={() => setConsentGiven(!consentGiven)}
      >
        {getAppTekst("oppsummering.samtykke-riktige-opplysninger.tekst")}
      </ConfirmationPanel>

      <nav className="navigation-container">
        <Button variant={"secondary"} onClick={() => goToDocumentation()} icon={<Left />}>
          {getAppTekst("knapp.forrige")}
        </Button>

        <Button onClick={() => finishSoknad()} disabled={!consentGiven}>
          {getAppTekst("oppsummering.send-soknad")}
        </Button>

        <Button variant={"secondary"} onClick={() => cancelSoknad()}>
          {getAppTekst("oppsummering.slett-soknad")}
        </Button>

        <NoSessionModal />
      </nav>
    </>
  );
}
