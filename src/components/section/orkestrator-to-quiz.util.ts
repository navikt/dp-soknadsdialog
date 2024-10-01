import { ISpørsmal } from "../../pages/api/common/orkestrator-api";
import { IQuizLandFaktum, QuizFaktum } from "../../types/quiz.types";

export function mapOrkestratorToQuiz(spørsmal: ISpørsmal): QuizFaktum {
  switch (spørsmal.type) {
    case "land":
      return quizedLand(spørsmal);

    default:
      throw new Error("Spørsmals type fra Orkestrator finnes ikke Quiz");
  }
}

function quizedLand(spørsmal: ISpørsmal): IQuizLandFaktum {
  const { id, gyldigeSvar, tekstnøkkel } = spørsmal;

  return {
    id: id,
    type: "land",
    gyldigeLand: gyldigeSvar,
    beskrivendeId: tekstnøkkel,
    readOnly: false,
    grupper: [
      {
        land: ["AUT", "HUN", "BGR", "BEL"],
        gruppeId: "faktum.hvilket-land-bor-barnet-ditt-i.gruppe.eøs",
      },
    ],
  };
}
