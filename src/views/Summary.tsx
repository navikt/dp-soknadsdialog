import React, { useState } from "react";
import { IQuizSeksjon } from "../types/quiz.types";
import { Accordion, Alert, Button, ConfirmationPanel } from "@navikt/ds-react";
import { Faktum } from "../components/faktum/Faktum";
import { Left } from "@navikt/ds-icons";
import styles from "./Soknad.module.css";
import { useRouter } from "next/router";
import api from "../api.utils";
import { useSanity } from "../context/sanity-context";

interface IProps {
  sections: IQuizSeksjon[];
}

export function Summary(props: IProps) {
  const [hasError, setHasError] = useState(false);
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const router = useRouter();
  const { getAppTekst, getSeksjonTextById } = useSanity();

  function goToSoknad() {
    router.push(`/${router.query.uuid}`);
  }

  function cancelSoknad() {
    router.push(`/`);
  }

  function finishSoknad() {
    return fetch(api(`/soknad/${router.query.uuid}/complete?locale=${router.locale}`))
      .then(() => {
        router.push(`/${router.query.uuid}/kvittering`);
      })
      .catch(() => setHasError(true));
  }

  if (hasError) {
    return (
      <>
        <Alert variant="error" size="medium">
          {getAppTekst("oppsummering.feil")}
        </Alert>
      </>
    );
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

      <nav className={styles.navigation}>
        <Button variant={"secondary"} onClick={() => goToSoknad()}>
          <Left />
          {getAppTekst("knapp.forrige")}
        </Button>

        <Button onClick={() => finishSoknad()} disabled={!consentGiven}>
          {getAppTekst("oppsummering.send-soknad")}
        </Button>

        <Button variant={"secondary"} onClick={() => cancelSoknad()}>
          {getAppTekst("oppsummering.slett-soknad")}
        </Button>
      </nav>
    </>
  );
}
