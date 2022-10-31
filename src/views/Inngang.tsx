import { InngangPaabegynt } from "../components/inngang-paabegynt/InngangPaabegynt";
import { InngangSendDocument } from "../components/inngang-send-document/InngangSendDocument";
import { PageMeta } from "../components/PageMeta";
import { useSanity } from "../context/sanity-context";
import { IInnsentSoknad, IPaabegyntSoknad } from "../types/quiz.types";

interface IProps {
  paabegynt?: IPaabegyntSoknad;
  innsendte?: IInnsentSoknad[];
}

export function Inngang({ paabegynt, innsendte }: IProps) {
  const { getAppText } = useSanity();

  return (
    <>
      <PageMeta
        title={getAppText("inngang.side-metadata.tittel")}
        description={getAppText("inngang.side-metadata.meta-beskrivelse")}
      />
      {innsendte && <InngangSendDocument innsendte={innsendte} />}
      {paabegynt && <InngangPaabegynt paabegynt={paabegynt} />}
    </>
  );
}
