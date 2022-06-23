import React from "react";
import { QuizSeksjon } from "../types/quiz.types";
import { Accordion } from "@navikt/ds-react";
import { Faktum } from "../components/faktum/Faktum";
import { Button } from "@navikt/ds-react";
import { Left } from "@navikt/ds-icons";
import styles from "./Soknad.module.css";
import { useRouter } from "next/router";
import api from "../api.utils";

interface Props {
  sections: QuizSeksjon[];
}

export function Summary(props: Props) {
  const router = useRouter();

  function goToSoknad() {
    router.push(`/${router.query.uuid}`);
  }

  function cancelSoknad() {
    router.push(`/`);
  }

  function finishSoknad() {
    alert("Vi skal sende inn søknaden ^___^");
    return fetch(api(`/soknad/${router.query.uuid}/complete`));
  }

  return (
    <>
      <Accordion>
        {props.sections?.map((section, index) => {
          return (
            <div key={section.beskrivendeId}>
              <Accordion.Item key={section.beskrivendeId}>
                <Accordion.Header>{section.beskrivendeId}</Accordion.Header>
                <Accordion.Content>
                  <>
                    {section.fakta.map((faktum) => {
                      return <Faktum key={faktum.id} faktum={faktum} readonly={true} />;
                    })}

                    <Button
                      variant="secondary"
                      onClick={() => router.push(`/${router.query.uuid}?seksjon=${index + 1}`)}
                    >
                      Endre svar
                    </Button>
                  </>
                </Accordion.Content>
              </Accordion.Item>
            </div>
          );
        })}
      </Accordion>

      <nav className={styles.navigation}>
        <Button variant={"secondary"} onClick={() => goToSoknad()}>
          <Left />
          Forrige steg
        </Button>

        <Button onClick={() => finishSoknad()}>Send inn søknad</Button>

        <Button variant={"secondary"} onClick={() => cancelSoknad()}>
          Slett søknad
        </Button>
      </nav>
    </>
  );
}
