import { IOpplysning } from "../types/orkestrator.types";
import { IQuizLandFaktum, QuizFaktum } from "../types/quiz.types";

export function mapOrkestratorToQuiz(opplysning: IOpplysning): QuizFaktum {
  switch (opplysning.type) {
    case "land":
      return quizedLand(opplysning);

    default:
      throw new Error("Spørsmals type fra Orkestrator finnes ikke Quiz");
  }
}

function quizedLand(opplysning: IOpplysning): IQuizLandFaktum {
  const { opplysningId, gyldigeSvar, tekstnøkkel } = opplysning;

  return {
    id: opplysningId,
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
