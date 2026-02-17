import { Button, Heading } from "@navikt/ds-react";
import Link from "next/link";
import { useState } from "react";
import { InngangPaabegynt } from "../../components/inngang-paabegynt/InngangPaabegynt";
import { InngangSendDocument } from "../../components/inngang-send-document/InngangSendDocument";
import { PageMeta } from "../../components/PageMeta";
import { useSanity } from "../../context/sanity-context";
import { IArbeidssokerStatus } from "../../pages/api/common/arbeidssoker-api";
import { IInnsentSoknad, IOrkestratorSoknad, IPaabegyntSoknad } from "../../types/quiz.types";
import styles from "./Inngang.module.css";
import {
  combineAndSortInnsendteSoknader,
  mapOrkestratorInnsendteSoknader,
  mapOrkestratorPaabegyntSoknader,
  mapQuizInnsendteSoknader,
} from "./inngang.utils";

interface IProps {
  paabegynt?: IPaabegyntSoknad;
  innsendte?: IInnsentSoknad[];
  orkestratorSoknader?: IOrkestratorSoknad[];
  arbeidssokerStatus: IArbeidssokerStatus;
  brukerdialogUrl: string;
}

export interface ICombinedInnsendtSoknad extends IInnsentSoknad {
  isOrkestratorSoknad: boolean;
}

export function Inngang(props: IProps) {
  const { getAppText } = useSanity();
  const [navigating, setNavigating] = useState(false);

  const destinationPage =
    props.arbeidssokerStatus === "REGISTERED" ? "/soknad/start-soknad" : "/soknad/arbeidssoker";

  const orkestratorInnsendteSoknader = mapOrkestratorInnsendteSoknader(props.orkestratorSoknader);
  const quizInnsendteSoknader = mapQuizInnsendteSoknader(props.innsendte);
  const innsendteSoknader = combineAndSortInnsendteSoknader(
    orkestratorInnsendteSoknader,
    quizInnsendteSoknader,
  );

  const orkestratorPaabegyntSoknader = mapOrkestratorPaabegyntSoknader(props.orkestratorSoknader);
  const paabegyntSoknad = props.paabegynt || orkestratorPaabegyntSoknader[0];
  const isOrkestratorPaabegyntSoknad = !props.paabegynt && Boolean(orkestratorPaabegyntSoknader[0]);

  return (
    <main id="maincontent" tabIndex={-1}>
      <PageMeta
        title={getAppText("inngang.side-metadata.tittel")}
        description={getAppText("inngang.side-metadata.meta-beskrivelse")}
      />
      <Heading level="1" size="xlarge" className={styles.inngangPageHeader}>
        {getAppText("inngang.tittel")}
      </Heading>
      {innsendteSoknader.length > 0 && (
        <InngangSendDocument
          innsendte={innsendteSoknader}
          brukerdialogUrl={props.brukerdialogUrl}
        />
      )}
      {paabegyntSoknad && (
        <InngangPaabegynt
          paabegynt={paabegyntSoknad}
          arbeidssokerStatus={props.arbeidssokerStatus}
          isOrkestratorSoknad={isOrkestratorPaabegyntSoknad}
          brukerdialogUrl={props.brukerdialogUrl}
        />
      )}
      {!paabegyntSoknad && (
        <Link href={destinationPage} passHref legacyBehavior>
          <Button variant="primary" as="a" loading={navigating} onClick={() => setNavigating(true)}>
            {getAppText("inngang.start-ny-soknad-knapp")}
          </Button>
        </Link>
      )}
    </main>
  );
}
