import { BodyLong, Button, Heading } from "@navikt/ds-react";
import Link from "next/link";
import { useSanity } from "../../context/sanity-context";
import styles from "./Arbeidssoker.module.css";

export function Arbeidssoker() {
  const { getAppText } = useSanity();

  return (
    <div className={styles.arbeidssokerContainer}>
      <Heading level="2" size="small">
        {getAppText("arbeidssoker.header")}
      </Heading>
      <BodyLong>{getAppText("arbeidssoker.beskrivelse")}</BodyLong>
      <div className={styles.arbeidssokerButtonContainer}>
        <Link href="https://arbeidssokerregistrering.nav.no/" passHref>
          <Button variant="primary" as="a">
            {getAppText("arbeidssoker.registrer-som-arbeidssoker-knapp")}
          </Button>
        </Link>
        <Link href={`https://www.nav.no/no/ditt-nav`} passHref>
          <Button variant="secondary">{getAppText("arbeidssoker.avbrytt-knapp")}</Button>
        </Link>
      </div>
      <BodyLong>
        <Link href="/">{getAppText("arbeidssoker.sok-om-dagpenger-likevel.lenke-tekst")}</Link>{" "}
        {getAppText("arbeidssoker.sok-om-dagpenger-likevel.beskrivelse")}
      </BodyLong>
    </div>
  );
}
