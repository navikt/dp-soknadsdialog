import { InngangPaabegynt } from "../components/inngang-paabegynt/InngangPaabegynt";
import { InngangSendDocument } from "../components/inngang-send-document/InngangSendDocument";
import { IInnsentSoknad, IPaabegyntSoknad } from "../types/quiz.types";

interface IProps {
  paabegynt?: IPaabegyntSoknad;
  innsendte?: IInnsentSoknad[];
}

export function Inngang({ paabegynt, innsendte }: IProps) {
  return (
    <>
      {innsendte && <InngangSendDocument innsendte={innsendte} />}
      {paabegynt && <InngangPaabegynt paabegynt={paabegynt} />}
    </>
  );
}
