import { IOpplysning } from "../types/orkestrator.types";
import {
  IQuizBooleanFaktum,
  IQuizLandFaktum,
  IQuizPeriodeFaktum,
  IQuizTekstFaktum,
  QuizFaktum,
} from "../types/quiz.types";

export function mapOrkestratorToQuiz(opplysning: IOpplysning): QuizFaktum {
  switch (opplysning.type) {
    case "tekst":
      return mappedText(opplysning);

    case "land":
      return mappedLand(opplysning);

    case "boolean":
      return mappedBoolean(opplysning);

    case "periode":
      return mappedPeriode(opplysning);

    default:
      throw new Error("Spørsmals type fra Orkestrator finnes ikke Quiz");
  }
}

function mappedText(opplysning: IOpplysning): IQuizTekstFaktum {
  const { opplysningId, tekstnøkkel, svar } = opplysning;

  return {
    id: opplysningId,
    type: "tekst",
    beskrivendeId: tekstnøkkel,
    svar: svar?.toString(),
    readOnly: false,
  };
}

function mappedLand(opplysning: IOpplysning): IQuizLandFaktum {
  const { opplysningId, gyldigeSvar, tekstnøkkel, svar } = opplysning;

  return {
    id: opplysningId,
    type: "land",
    gyldigeLand: gyldigeSvar,
    beskrivendeId: tekstnøkkel,
    readOnly: false,
    svar: svar?.toString(),
    grupper: [
      {
        land: [],
        gruppeId: "",
      },
    ],
  };
}

function mappedBoolean(opplysning: IOpplysning): IQuizBooleanFaktum {
  const { opplysningId, tekstnøkkel, svar } = opplysning;

  function parsedSvar() {
    if (!svar) return undefined;

    return svar === "true";
  }

  return {
    id: opplysningId,
    type: "boolean",
    svar: parsedSvar(),
    gyldigeValg: [`${tekstnøkkel}.svar.ja`, `${tekstnøkkel}.svar.nei`],
    beskrivendeId: tekstnøkkel,
    readOnly: false,
  };
}

function mappedPeriode(opplysning: IOpplysning): IQuizPeriodeFaktum {
  const { opplysningId, tekstnøkkel, svar } = opplysning;

  function parsedSvar() {
    if (!svar) return undefined;

    const { fom, tom } = JSON.parse(svar.toString());

    return {
      fom,
      tom: tom || undefined,
    };
  }

  return {
    id: opplysningId,
    type: "periode",
    beskrivendeId: tekstnøkkel,
    readOnly: false,
    svar: parsedSvar(),
  };
}
