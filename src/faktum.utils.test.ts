import { getAnswerValuesByFaktumType } from "./faktum.utils";
import { Answer } from "./store/answers.slice";
import { FaktumType } from "./types/faktum.types";

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
});
