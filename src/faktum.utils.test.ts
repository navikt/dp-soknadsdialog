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
    const barnListegeneratorFaktum: IGeneratorFaktum = {
      id: "asdasd",
      textId: BARN_LISTE_FAKTUM_ID,
      title: "test-title",
      type: "generator",
      faktum: [
        { textId: "", title: "", id: "faktum.egen-naering-organisasjonsnummer", type: "int" },
      ],
    };
    const arbeidsforholdGeneratorFaktum: IGeneratorFaktum = {
      id: "asdasd",
      textId: ARBEIDSFORHOLD_FAKTUM_ID,
      title: "test-title",
      type: "generator",
      faktum: [
        { textId: "", title: "", id: "faktum.egen-naering-organisasjonsnummer", type: "int" },
      ],
    };

    const createState: GeneratorState = (textId: string) => ({
      id: "",
      textId: textId,
      type: "generator",
      answers: [],
    });

    it("should return true for faktum.barn-liste", () => {
      generatorState = createState("faktum.barn-liste");
      const result = isGeneratorFaktumAnswered(barnListegeneratorFaktum, [generatorState]);
      expect(result).toBeTruthy();
    });

    it("should return true for faktum.arbeidsforhold", () => {
      generatorState = createState("faktum.arbeidsforhold");
      const result = isGeneratorFaktumAnswered(arbeidsforholdGeneratorFaktum, [generatorState]);
      expect(result).toBeTruthy();
    });
  });
});
