import { InngangPaabegynt } from "../components/inngang-paabegynt/InngangPaabegynt";
import { InngangSendDocument } from "../components/inngang-send-document/InngangSendDocument";
import { IMineSoknader } from "../types/quiz.types";

export function Inngang({ paabegynt, innsendte }: IMineSoknader) {
  return (
    <main>
      {paabegynt && <InngangPaabegynt {...paabegynt} />}
      {innsendte && <InngangSendDocument innsendte={innsendte} />}
    </main>
  );
}
