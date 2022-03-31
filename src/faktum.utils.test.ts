import {
  ARBEIDSFORHOLD_FAKTUM_ID,
  BARN_LISTE_FAKTUM_ID,
  getAnswerValuesByFaktumType,
  isGeneratorFaktumAnswered,
} from "./faktum.utils";
import { Answer } from "./store/answers.slice";
import { GeneratorState } from "./store/generator-utils";
import { FaktumType, IGeneratorFaktum } from "./types/faktum.types";

describe("faktum.utils", () => {
  describe("getAnswerValuesByFaktumType", () => {
    const answers: Answer[] = [
      {
        id: "5003",
        textId: "faktum.arbeidsloshet-garantikassen-for-fiskere-periode",
        type: "tekst",
        value: "Frans er tøff",
      },
      {
        textId: "faktum.andre-ytelser",
        value: ["faktum.andre-ytelser.svar.pensjon-offentlig-tjenestepensjon"],
        type: "flervalg",
        id: "5001",
      },
      {
        textId: "faktum.tjenestepensjon-hvem-utbetaler-hvilken-periode",
        value: "13123",
        type: "envalg",
        id: "5002",
      },
    ];
    it("should only return answer.values matching input types [flervalg, envalg]", () => {
      const types: FaktumType[] = ["flervalg", "envalg"];
      const result = getAnswerValuesByFaktumType(answers, types);
      const expected = ["faktum.andre-ytelser.svar.pensjon-offentlig-tjenestepensjon", "13123"];
      expect(result).toEqual(expected);
    });

    it("should only return answer.values matching input types [flervalg]", () => {
      const types: FaktumType[] = ["flervalg"];
      const result = getAnswerValuesByFaktumType(answers, types);
      const expected = ["faktum.andre-ytelser.svar.pensjon-offentlig-tjenestepensjon"];
      expect(result).toEqual(expected);
    });
  });

  describe("isGeneratorFaktumAnswered", () => {
    let generatorState: GeneratorState;
    let generatorFaktum: IGeneratorFaktum;

    it("should return false when faktum does not exist in state", () => {
      generatorState = createState("faktum.some-state", true);
      generatorFaktum = createGeneratorFaktum("faktum.not-in-state");
      const result = isGeneratorFaktumAnswered(generatorFaktum, [generatorState]);
      expect(result).toBeFalsy();
    });

    it("should return true for faktum.barn-liste", () => {
      generatorState = createState(BARN_LISTE_FAKTUM_ID);
      generatorFaktum = createGeneratorFaktum(BARN_LISTE_FAKTUM_ID);
      const result = isGeneratorFaktumAnswered(generatorFaktum, [generatorState]);
      expect(result).toBeTruthy();
    });

    it("should return true for faktum.arbeidsforhold", () => {
      generatorState = createState(ARBEIDSFORHOLD_FAKTUM_ID);
      generatorFaktum = createGeneratorFaktum(ARBEIDSFORHOLD_FAKTUM_ID);
      const result = isGeneratorFaktumAnswered(generatorFaktum, [generatorState]);
      expect(result).toBeTruthy();
    });

    it("should return false when faktum is unanswered", () => {
      generatorState = createState("faktum.annet-generator-faktum");
      generatorFaktum = createGeneratorFaktum("faktum.annet-generator-faktum");
      const result = isGeneratorFaktumAnswered(generatorFaktum, [generatorState]);
      expect(result).toBeFalsy();
    });

    it("should return true when faktum is answered", () => {
      generatorState = createState("faktum.annet-generator-faktum", true);
      generatorFaktum = createGeneratorFaktum("faktum.annet-generator-faktum");
      const result = isGeneratorFaktumAnswered(generatorFaktum, [generatorState]);
      expect(result).toBeTruthy();
    });
  });
});

function createState(textId: string, withAnswer = false): GeneratorState {
  const answer: Answer = {
    id: "test-id",
    textId,
    type: "tekst",
    value: "helo",
  };
  return {
    id: "",
    textId: textId,
    type: "generator",
    answers: withAnswer ? [[answer]] : [],
  };
}

function createGeneratorFaktum(textId: string): IGeneratorFaktum {
  return {
    id: "asdasd",
    textId,
    title: "test-title",
    type: "generator",
    faktum: [{ textId: "", title: "", id: "faktum.egen-naering-organisasjonsnummer", type: "int" }],
  };
}
