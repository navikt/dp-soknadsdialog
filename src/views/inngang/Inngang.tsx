import { useState } from "react";
import { Button, Heading } from "@navikt/ds-react";
import Link from "next/link";
import { InngangPaabegynt } from "../../components/inngang-paabegynt/InngangPaabegynt";
import { InngangSendDocument } from "../../components/inngang-send-document/InngangSendDocument";
import { PageMeta } from "../../components/PageMeta";
import { useSanity } from "../../context/sanity-context";
import { IInnsentSoknad, IPaabegyntSoknad } from "../../types/quiz.types";
import styles from "./Inngang.module.css";
import { IArbeidssokerStatus } from "../../pages/api/common/arbeidssoker-api";

interface IProps {
  paabegynt?: IPaabegyntSoknad;
  innsendte?: IInnsentSoknad[];
  arbeidssokerStatus: IArbeidssokerStatus;
}

export function Inngang(props: IProps) {
  const { getAppText } = useSanity();
  const [navigating, setNavigating] = useState(false);

  const destinationPage =
    props.arbeidssokerStatus === "REGISTERED" ? "/soknad/start-soknad" : "/soknad/arbeidssoker";

  return (
    <main id="maincontent" tabIndex={-1}>
      <PageMeta
        title={getAppText("inngang.side-metadata.tittel")}
        description={getAppText("inngang.side-metadata.meta-beskrivelse")}
      />
      <Heading level="1" size="xlarge" className={styles.inngangPageHeader}>
        {getAppText("inngang.tittel")}
      </Heading>
      {props.innsendte && <InngangSendDocument innsendte={props.innsendte} />}
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
