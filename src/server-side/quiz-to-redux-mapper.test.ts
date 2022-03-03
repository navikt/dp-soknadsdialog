import { QuizPrimitiveFaktum, QuizGeneratorFaktum } from "../types/quiz.types";
import { mapQuizFaktaToReduxState } from "./quiz-to-redux-mapper";

const booleanInput: QuizPrimitiveFaktum = {
  id: "1",
  type: "boolean",
  beskrivendeId: "faktum.dummy-boolean",
  svar: true,
};

const intInput: QuizPrimitiveFaktum = {
  id: "2",
  type: "int",
  beskrivendeId: "faktum.dummy-int",
  svar: 40,
};

const doubleInput: QuizPrimitiveFaktum = {
  id: "3",
  type: "double",
  beskrivendeId: "faktum.dummy-double",
  svar: 40.0,
};

const envalgInput: QuizPrimitiveFaktum = {
  id: "4",
  type: "envalg",
  beskrivendeId: "faktum.dummy-envalg",
  svar: "faktum.dummy-envalg.svar",
};

const flervalgInput: QuizPrimitiveFaktum = {
  id: "5",
  type: "flervalg",
  beskrivendeId: "faktum.dummy-flervalg",
  svar: ["faktum.dummy-flervalg.svar.en", "faktum.dummy-flervalg.svar.to"],
};

const booleanExpected = {
  id: "1",
  beskrivendeId: "faktum.dummy-boolean",
  type: "boolean",
  answer: "faktum.dummy-boolean.svar.ja",
};

const intExpected = {
  id: "2",
  beskrivendeId: "faktum.dummy-int",
  type: "int",
  answer: 40,
};

const doubleExpected = {
  id: "3",
  beskrivendeId: "faktum.dummy-double",
  type: "double",
  answer: 40.0,
};

const envalgExpected = {
  id: "4",
  beskrivendeId: "faktum.dummy-envalg",
  type: "envalg",
  answer: "faktum.dummy-envalg.svar",
};

const flervalgExpected = {
  id: "5",
  beskrivendeId: "faktum.dummy-flervalg",
  type: "flervalg",
  answer: ["faktum.dummy-flervalg.svar.en", "faktum.dummy-flervalg.svar.to"],
};

describe("mapFaktaToAnswers", () => {
  test("maps boolean faktum", () => {
    const expected = {
      answers: [booleanExpected],
    };
    expect(mapQuizFaktaToReduxState([booleanInput])).toEqual(expected);
  });

  test("maps int faktum", () => {
    const expected = {
      answers: [intExpected],
    };
    expect(mapQuizFaktaToReduxState([intInput])).toEqual(expected);
  });

  test("maps double faktum", () => {
    const expected = {
      answers: [doubleExpected],
    };
    expect(mapQuizFaktaToReduxState([doubleInput])).toEqual(expected);
  });

  test("maps envalg faktum", () => {
    const expected = {
      answers: [envalgExpected],
    };
    expect(mapQuizFaktaToReduxState([envalgInput])).toEqual(expected);
  });

  test("maps flervalg faktum", () => {
    const expected = {
      answers: [flervalgExpected],
    };
    expect(mapQuizFaktaToReduxState([flervalgInput])).toEqual(expected);
  });

  test("ignores faktum without answer", () => {
    const input: QuizPrimitiveFaktum[] = [
      {
        id: "6",
        type: "flervalg",
        beskrivendeId: "faktum.dummy-flervalg",
      },
    ];
    expect(mapQuizFaktaToReduxState(input)).toEqual({ answers: [] });
  });

  test("map arbeidsforhold generator faktum to answer", () => {
    const generatorInput: QuizGeneratorFaktum[] = [
      {
        id: "7",
        beskrivendeId: "faktum.arbeidsforhold",
        type: "generator",
        svar: [[booleanInput, intInput, doubleInput, envalgInput, flervalgInput]],
        templates: [],
      },
    ];

    const expected = {
      id: "7",
      beskrivendeId: "faktum.arbeidsforhold",
      type: "generator",
      answers: [
        {
          answers: [booleanExpected, intExpected, doubleExpected, envalgExpected, flervalgExpected],
        },
      ],
    };

    expect(mapQuizFaktaToReduxState(generatorInput)).toEqual({
      answers: [],
      arbeidsforhold: expected,
    });
  });
});
