import {
  ARBEIDSFORHOLD_FAKTUM_ID,
  BARN_LISTE_FAKTUM_ID,
  getAnswerValuesByFaktumType,
  isFaktumAnswered,
  isGeneratorFaktumAnswered,
} from "./faktum.utils";
import { Answer } from "./store/answers.slice";
import { GeneratorState } from "./store/generator-utils";
import {
  FaktumType,
  IFaktum,
  IGeneratorFaktum,
  IPrimitivFaktum,
  IValgFaktum,
} from "./types/faktum.types";

const textFaktum: IPrimitivFaktum = {
  id: "",
  textId: "faktum.tekst",
  title: "",
  type: "tekst",
};

const generatorFaktum: IGeneratorFaktum = {
  id: "",
  textId: "faktum.generator",
  title: "",
  type: "generator",
  fakta: [textFaktum],
};

const arbeidsforholdFaktum: IGeneratorFaktum = {
  id: "",
  textId: ARBEIDSFORHOLD_FAKTUM_ID,
  title: "",
  type: "generator",
  fakta: [],
};

const barnFaktum: IGeneratorFaktum = {
  id: "",
  textId: BARN_LISTE_FAKTUM_ID,
  title: "",
  type: "generator",
  fakta: [],
};

const envalgFaktumWithSubFaktum: IValgFaktum = {
  id: "",
  textId: "faktum.envalg",
  title: "",
  type: "envalg",
  answerOptions: [{ textId: "faktum.envalg.svar", title: "ikke bry deg" }],
  subFakta: [
    {
      ...textFaktum,
      requiredAnswerIds: ["faktum.envalg.svar"],
    },
  ],
};

const envalgFaktumWithGeneratorSubFaktum: IValgFaktum = {
  id: "",
  textId: "faktum.envalg",
  title: "",
  type: "envalg",
  answerOptions: [{ textId: "faktum.envalg.svar", title: "ikke bry deg" }],
  subFakta: [
    {
      ...generatorFaktum,
      requiredAnswerIds: ["faktum.envalg.svar"],
    },
  ],
};

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
    it("should return false when faktum does not exist in state", () => {
      const result = isGeneratorFaktumAnswered(generatorFaktum, []);
      expect(result).toBeFalsy();
    });

    it("should return true for faktum.barn-liste", () => {
      const generatorState = createGeneratorState(barnFaktum);
      const result = isGeneratorFaktumAnswered(barnFaktum, [generatorState]);
      expect(result).toBeTruthy();
    });

    it("should return true for faktum.arbeidsforhold", () => {
      const generatorState = createGeneratorState(arbeidsforholdFaktum);
      const result = isGeneratorFaktumAnswered(arbeidsforholdFaktum, [generatorState]);
      expect(result).toBeTruthy();
    });

    it("should return false when faktum is unanswered", () => {
      const generatorState = createGeneratorState(generatorFaktum);
      const result = isGeneratorFaktumAnswered(generatorFaktum, [generatorState]);
      expect(result).toBeFalsy();
    });

    it("should return true when faktum is answered", () => {
      const generatorState = createGeneratorState(generatorFaktum, true);
      const result = isGeneratorFaktumAnswered(generatorFaktum, [generatorState]);
      expect(result).toBeTruthy();
    });
  });

  describe("isFaktumAnswered", () => {
    it("should return true when faktum is answered and has no subfaktum", () => {
      const faktaToAnswer = [textFaktum];
      const answerState = faktaToAnswer.map((faktum) => createAnswerState(faktum));
      const result = isFaktumAnswered(textFaktum, answerState, []);
      expect(result).toBeTruthy();
    });

    it("should return false when faktum is unanswered and has no subfaktum", () => {
      const result = isFaktumAnswered(textFaktum, [], []);
      expect(result).toBeFalsy();
    });

    it("should return true when faktum is answered and subfaktum is answered", () => {
      const faktaToAnswer = [textFaktum, envalgFaktumWithSubFaktum];
      const answerState = faktaToAnswer.map((faktum) => createAnswerState(faktum));
      const result = isFaktumAnswered(envalgFaktumWithSubFaktum, answerState, []);
      expect(result).toBeTruthy();
    });

    it("should return false when faktum is answered and subfaktum is not answered", () => {
      const faktaToAnswer = [envalgFaktumWithSubFaktum];
      const answerState = faktaToAnswer.map((faktum) => createAnswerState(faktum));
      const result = isFaktumAnswered(envalgFaktumWithSubFaktum, answerState, []);
      expect(result).toBeFalsy();
    });

    it("should return true when faktum is answered and subfaktum is generatorFaktum and is answered", () => {
      const faktaToAnswer = [envalgFaktumWithGeneratorSubFaktum];
      const answerState = faktaToAnswer.map((faktum) => createAnswerState(faktum));
      const generatorState = createGeneratorState(generatorFaktum, true);
      const result = isFaktumAnswered(envalgFaktumWithGeneratorSubFaktum, answerState, [
        generatorState,
      ]);
      expect(result).toBeTruthy();
    });

    it("should return false when faktum is answered and subfaktum is generatorFaktum and is unanswered", () => {
      const faktaToAnswer = [envalgFaktumWithGeneratorSubFaktum];
      const answerState = faktaToAnswer.map((faktum) => createAnswerState(faktum));
      const generatorState = createGeneratorState(generatorFaktum);
      const result = isFaktumAnswered(envalgFaktumWithGeneratorSubFaktum, answerState, [
        generatorState,
      ]);
      expect(result).toBeFalsy();
    });
  });
});

function createAnswerState(faktum: IFaktum): Answer {
  return {
    id: faktum.id,
    textId: faktum.textId,
    type: faktum.type,
    value: `${faktum.textId}.svar`,
  };
}

function createGeneratorState(faktum: IGeneratorFaktum, withAnswer = false): GeneratorState {
  const answers = [];

  if (withAnswer) {
    const generatorAnswers = faktum.fakta.map((faktum) => createAnswerState(faktum));
    answers.push(generatorAnswers);
  }

  return {
    id: faktum.id,
    textId: faktum.textId,
    type: "generator",
    answers: answers,
  };
}
