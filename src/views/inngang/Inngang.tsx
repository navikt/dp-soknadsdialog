import { useState } from "react";
import { Button, Heading } from "@navikt/ds-react";
import Link from "next/link";
import { InngangPaabegynt } from "../../components/inngang-paabegynt/InngangPaabegynt";
import { InngangSendDocument } from "../../components/inngang-send-document/InngangSendDocument";
import { PageMeta } from "../../components/PageMeta";
import { useSanity } from "../../context/sanity-context";
import { IInnsentSoknad, IOrkestratorSoknad, IPaabegyntSoknad } from "../../types/quiz.types";
import styles from "./Inngang.module.css";
import { IArbeidssokerStatus } from "../../pages/api/common/arbeidssoker-api";

interface IProps {
  paabegynt?: IPaabegyntSoknad;
  innsendte?: IInnsentSoknad[];
  orkestratorSoknader: IOrkestratorSoknad[];
  arbeidssokerStatus: IArbeidssokerStatus;
  brukerdialogUrl: string;
}

export interface IExtendedOrkestratorSoknad extends IInnsentSoknad {
  isOrkestratorSoknad: boolean;
}

export function Inngang(props: IProps) {
  const { getAppText } = useSanity();
  const [navigating, setNavigating] = useState(false);

  const destinationPage =
    props.arbeidssokerStatus === "REGISTERED" ? "/soknad/start-soknad" : "/soknad/arbeidssoker";

  const orkestratorInnsendte: IExtendedOrkestratorSoknad[] =
    props.orkestratorSoknader
      ?.filter(
        (soknad) =>
          soknad.status === "INNSENDT" ||
          soknad.status === "JOURNALFØRT" ||
          soknad.status === "GODKJENT",
      )
      .map((soknad) => ({
        soknadUuid: soknad.søknadId,
        forstInnsendt: soknad.innsendtTimestamp,
        isOrkestratorSoknad: true,
      })) || [];

  const standardInnsendte: IExtendedOrkestratorSoknad[] =
    props.innsendte?.map((soknad) => ({
      ...soknad,
      isOrkestratorSoknad: false,
    })) || [];

  const alleInnsendte: IExtendedOrkestratorSoknad[] = [
    ...orkestratorInnsendte,
    ...standardInnsendte,
  ].sort((a, b) => new Date(b.forstInnsendt).getTime() - new Date(a.forstInnsendt).getTime());

  // const orkestratorPaabegynt: IPaabegyntSoknad[] =
  //   props.orkestratorSoknader
  //     ?.filter((soknad) => soknad.status === "PÅBEGYNT")
  //     .map((soknad) => ({
  //       soknadUuid: soknad.søknadId,
  //       opprettet: soknad.oppdatertTidspunkt,
  //       sistEndretAvbruker: soknad.oppdatertTidspunkt,
  //     })) || [];

  return (
    <main id="maincontent" tabIndex={-1}>
      <PageMeta
        title={getAppText("inngang.side-metadata.tittel")}
        description={getAppText("inngang.side-metadata.meta-beskrivelse")}
      />
      <Heading level="1" size="xlarge" className={styles.inngangPageHeader}>
        {getAppText("inngang.tittel")}
      </Heading>
      {alleInnsendte.length > 0 && (
        <InngangSendDocument innsendte={alleInnsendte} brukerdialogUrl={props.brukerdialogUrl} />
      )}
      {props.paabegynt && (
        <InngangPaabegynt
          paabegynt={props.paabegynt}
          arbeidssokerStatus={props.arbeidssokerStatus}
        />
      )}
      {!props.paabegynt && (
        <Link href={destinationPage} passHref legacyBehavior>
          <Button variant="primary" as="a" loading={navigating} onClick={() => setNavigating(true)}>
            {getAppText("inngang.start-ny-soknad-knapp")}
          </Button>
        </Link>
      )}
    </main>
  );
}
