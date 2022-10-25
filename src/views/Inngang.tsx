import { InngangPaabegynt } from "../components/inngang-paabegynt/InngangPaabegynt";
import { InngangSendDocument } from "../components/inngang-send-document/InngangSendDocument";
import { IArbeidssokerStatus } from "../pages/api/arbeidssoker";
import { IInnsentSoknad, IPaabegyntSoknad } from "../types/quiz.types";

interface IProps {
  paabegynt?: IPaabegyntSoknad;
  innsendte?: IInnsentSoknad[];
  arbeidssokerStatus?: IArbeidssokerStatus;
}

export function Inngang({ paabegynt, innsendte, arbeidssokerStatus }: IProps) {
  return (
    <>
      {innsendte && <InngangSendDocument innsendte={innsendte} />}
      {paabegynt && (
        <InngangPaabegynt paabegynt={paabegynt} arbeidssokerStatus={arbeidssokerStatus} />
      )}
    </>
  );
}
