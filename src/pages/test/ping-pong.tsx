import { ApiFaktumType } from "../api/mock/mock-data";
import { PingPong } from "../../components/ping-pong/PingPong";

interface ApiFaktum {
  id: string; // reell-arbeidsoker.faktum.alle-typer-arbeid
  sectionId: string; // reell-arbeidsoker
  type: ApiFaktumType; // boolean
  answers: ApiAnswer[];
}
interface ApiAnswer {
  id: string;
}

export default function PingPongPage() {
  return <PingPong />;
}
