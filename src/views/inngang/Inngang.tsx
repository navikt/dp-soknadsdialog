import { Heading } from "@navikt/ds-react";
import { InngangPaabegynt } from "../../components/inngang-paabegynt/InngangPaabegynt";
import { InngangSendDocument } from "../../components/inngang-send-document/InngangSendDocument";
import { PageMeta } from "../../components/PageMeta";
import { useSanity } from "../../context/sanity-context";
import { IArbeidssokerStatus } from "../../pages/api/arbeidssoker";
import { IInnsentSoknad, IPaabegyntSoknad } from "../../types/quiz.types";
import styles from "./Inngang.module.css";

interface IProps {
  paabegynt?: IPaabegyntSoknad;
  innsendte?: IInnsentSoknad[];
  arbeidssokerStatus: IArbeidssokerStatus;
}

export function Inngang({ paabegynt, innsendte, arbeidssokerStatus }: IProps) {
  const { getAppText } = useSanity();

  return (
    <>
      <PageMeta
        title={getAppText("inngang.side-metadata.tittel")}
        description={getAppText("inngang.side-metadata.meta-beskrivelse")}
      />
      <Heading level="1" size="xlarge" className={styles.inngangPageHeader}>
        {getAppText("inngang.tittel")}
      </Heading>
      {innsendte && <InngangSendDocument innsendte={innsendte} />}
      <InngangPaabegynt paabegynt={paabegynt ?? null} arbeidssokerStatus={arbeidssokerStatus} />
    </>
  );
}
