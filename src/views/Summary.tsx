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
import api from "../api.utils";

interface IProps {
  sections: IQuizSeksjon[];
}

export function Summary(props: IProps) {
  const router = useRouter();
  const [hasError, setHasError] = useState(false);
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const { getAppTekst, getSeksjonTextById } = useSanity();

  function goToDocumentation() {
    router.push(`/${router.query.uuid}/dokumentasjon`);
  }

  function cancelSoknad() {
    router.push(`/`);
  }

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
                      {getAppTekst("oppsummering.knapp.endre-svar")}
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
        label={getAppTekst("oppsummering.checkbox.samtykke-riktige-opplysninger.label")}
        onChange={() => setConsentGiven(!consentGiven)}
      >
        {getAppTekst("oppsummering.checkbox.samtykke-riktige-opplysninger.tekst")}
      </ConfirmationPanel>

      <nav className="navigation-container">
        <Button variant={"secondary"} onClick={() => goToDocumentation()} icon={<Left />}>
          {getAppTekst("soknad.soknad.knapp.forrige-steg")}
        </Button>

        <Button onClick={() => finishSoknad()} disabled={!consentGiven}>
          {getAppTekst("oppsummering.knapp.send-soknad")}
        </Button>

        <Button variant={"secondary"} onClick={() => cancelSoknad()}>
          {getAppTekst("oppsummering.knapp.slett-soknad")}
        </Button>

        <NoSessionModal />
      </nav>
    </>
  );
}
