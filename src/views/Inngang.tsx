// import { InngangPaabegynt } from "../components/inngang-paabegynt/InngangPaabegynt";
// import { InngangSendDocument } from "../components/inngang-send-document/InngangSendDocument";
import { IMineSoknader } from "../types/quiz.types";

export function Inngang(props: IMineSoknader) {
  // eslint-disable-next-line no-console
  console.log(props);
  return (
    <main>
      Inngang
      {/* {paabegynt && <InngangPaabegynt {...paabegynt} />} */}
      {/* {innsendte && <InngangSendDocument innsendte={innsendte} />} */}
    </main>
  );
}
