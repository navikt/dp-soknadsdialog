import { Alert, BodyLong, Button, Heading } from "@navikt/ds-react";
import Link from "next/link";
import { PageMeta } from "../../components/PageMeta";
import { useSanity } from "../../context/sanity-context";
import { IArbeidssokerStatus } from "../../api/arbeidssoker-api";
import { SoknadHeader } from "../../components/soknad-header/SoknadHeader";
import styles from "./Arbeidssoker.module.css";

interface IProps {
  arbeidssokerStatus: IArbeidssokerStatus;
}

export function Arbeidssoker(props: IProps) {
  const { getAppText } = useSanity();

  return (
    <>
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
            <Link href="https://arbeidssokerregistrering.nav.no/" passHref>
              <Button variant="primary" as="a">
                {getAppText("arbeidssoker.registrer-som-arbeidssoker-knapp")}
              </Button>
            </Link>
            <Link href={`https://www.nav.no/no/ditt-nav`} passHref>
              <Button variant="secondary">{getAppText("arbeidssoker.avbryt-knapp")}</Button>
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
      {props.arbeidssokerStatus === "UNKNOWN" && (
        <>
          <Heading level="2" size="small">
            {getAppText("arbeidssoker.header")}
          </Heading>
          <Alert variant="warning" className={styles.arbeidssokerStatusErrorWarning}>
            {getAppText("arbeidssoker.arbeidssoker-status.varsel-tekst")}
          </Alert>
          <div className="navigation-container">
            <Link href="/soknad/start-soknad" passHref>
              <Button variant="primary" as="a">
                {getAppText("arbeidssoker.sok-dagpenger.knapp")}
              </Button>
            </Link>
            <Link href={`https://www.nav.no/no/ditt-nav`} passHref>
              <Button variant="secondary">{getAppText("arbeidssoker.avbryt-knapp")}</Button>
            </Link>
          </div>
        </>
      )}
    </>
  );
}
