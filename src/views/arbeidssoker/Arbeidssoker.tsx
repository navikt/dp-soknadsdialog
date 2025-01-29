import { useState } from "react";
import { Alert, BodyLong, Button, Heading } from "@navikt/ds-react";
import Link from "next/link";
import { PageMeta } from "../../components/PageMeta";
import { useSanity } from "../../context/sanity-context";
import { SoknadHeader } from "../../components/soknad-header/SoknadHeader";
import styles from "./Arbeidssoker.module.css";
import { IArbeidssokerProps } from "../../pages/soknad/arbeidssoker";

type currentNagivatingType =
  | "registrer-som-arbeidssoker-button"
  | "registrer-som-arbeidssoker-cancel-button"
  | "start-soknad-button";

export function Arbeidssoker(props: IArbeidssokerProps) {
  const { getAppText } = useSanity();
  const [currentNagivating, setCurrentNavigating] = useState<currentNagivatingType | undefined>(
    undefined,
  );

  return (
    <main id="maincontent" tabIndex={-1}>
      <PageMeta
        title={getAppText("arbeidssoker.side-metadata.tittel")}
        description={getAppText("arbeidssoker.side-metadata.meta-beskrivelse")}
      />
      <SoknadHeader />
      {props.arbeidssokerStatus === "UNREGISTERED" && (
        <>
          <Heading level="2" size="small">
            {getAppText("arbeidssoker.header")}
          </Heading>
          <BodyLong>{getAppText("arbeidssoker.beskrivelse")}</BodyLong>
          <div className="navigation-container">
            <Link
              href={props.arbeidssokerregistreringUrl || "https://arbeidssokerregistrering.nav.no/"}
              passHref
              legacyBehavior
            >
              <Button
                variant="primary"
                as="a"
                onClick={() => setCurrentNavigating("registrer-som-arbeidssoker-button")}
              >
                {getAppText("arbeidssoker.registrer-som-arbeidssoker-knapp")}
              </Button>
            </Link>
            <Link href="https://www.nav.no/min-side" passHref legacyBehavior>
              <Button
                variant="secondary"
                as="a"
                onClick={() => setCurrentNavigating("registrer-som-arbeidssoker-cancel-button")}
              >
                {getAppText("arbeidssoker.avbryt-knapp")}
              </Button>
            </Link>
          </div>
          <BodyLong className={styles.arbeidssokerSokDagpengerLikevel}>
            <Link href="/soknad/start-soknad">
              {getAppText("arbeidssoker.sok-dagpenger-likevel.lenke-tekst")}
            </Link>
            {getAppText("arbeidssoker.sok-dagpenger-likevel.beskrivelse-tekst")}
          </BodyLong>
        </>
      )}
      {props.arbeidssokerStatus === "ERROR" && (
        <>
          <Heading level="2" size="small">
            {getAppText("arbeidssoker.header")}
          </Heading>
          <Alert variant="warning" className={styles.arbeidssokerStatusErrorWarning}>
            {getAppText("arbeidssoker.arbeidssoker-status.varsel-tekst")}
          </Alert>
          <div className="navigation-container">
            <Link href="https://arbeidssokerregistrering.nav.no/">
              {getAppText("arbeidssoker.registrer-som-arbeidssoker-knapp")}
            </Link>
          </div>
          <div className="navigation-container">
            <Link href="/soknad/start-soknad" passHref legacyBehavior>
              <Button
                variant="primary"
                as="a"
                onClick={() => setCurrentNavigating("start-soknad-button")}
                loading={currentNagivating === "start-soknad-button"}
              >
                {getAppText("arbeidssoker.sok-dagpenger.knapp")}
              </Button>
            </Link>
            <Link href="https://www.nav.no/min-side" passHref legacyBehavior>
              <Button
                variant="secondary"
                as="a"
                onClick={() => setCurrentNavigating("registrer-som-arbeidssoker-button")}
              >
                {getAppText("arbeidssoker.avbryt-knapp")}
              </Button>
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
