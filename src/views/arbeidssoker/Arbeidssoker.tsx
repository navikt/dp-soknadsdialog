import { Alert, BodyLong, Button, Heading } from "@navikt/ds-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { deleteSoknad } from "../../api/deleteSoknad-api";
import { ErrorRetryModal } from "../../components/error-retry-modal/ErrorRetryModal";
import { PageMeta } from "../../components/PageMeta";
import { useSanity } from "../../context/sanity-context";
import { IArbeidssokerStatus } from "../../pages/api/arbeidssoker";
import { ErrorTypesEnum } from "../../types/error.types";
import styles from "./Arbeidssoker.module.css";
interface IProps {
  soknadUuid: string;
  arbeidssokerStatus: IArbeidssokerStatus;
}

export function Arbeidssoker({ soknadUuid, arbeidssokerStatus }: IProps) {
  const { getAppText } = useSanity();
  const router = useRouter();
  const [hasDeleteSoknadError, setHasDeleteSoknadError] = useState(false);

  useEffect(() => {
    if (arbeidssokerStatus === "REGISTERED") {
      deleteSoknadAndNavigateToFrontPage();
    }
  }, []);

  async function deleteSoknadAndNavigateToFrontPage() {
    const deleteSoknadResponse = await deleteSoknad(soknadUuid);

    if (deleteSoknadResponse.ok) {
      router.push("/start-soknad");
    } else {
      setHasDeleteSoknadError(true);
      throw new Error(deleteSoknadResponse.statusText);
    }
  }

  return (
    <>
      <PageMeta
        title={getAppText("arbeidssokerstatus.side-metadata.tittel")}
        metaDescription={getAppText("arbeidssokerstatus.side-metadata.meta-beskrivelse")}
      />
      {arbeidssokerStatus === "UNREGISTERED" && (
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
            <Link href="/start-soknad">
              {getAppText("arbeidssoker.sok-dagpenger-likevel.lenke-tekst")}
            </Link>
            {getAppText("arbeidssoker.sok-dagpenger-likevel.beskrivelse-tekst")}
          </BodyLong>
        </>
      )}
      {arbeidssokerStatus === "UNKNOWN" && (
        <>
          <Heading level="2" size="small">
            {getAppText("arbeidssoker.header")}
          </Heading>
          <Alert variant="warning" className={styles.arbeidssokerStatusErrorWarning}>
            {getAppText("arbeidssoker.arbeidssoker-status.varsel-tekst")}
          </Alert>
          <div className="navigation-container">
            <Link href="/start-soknad" passHref>
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
      {hasDeleteSoknadError && <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />}
    </>
  );
}
