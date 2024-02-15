import { subMonths } from "date-fns";
import { IQuizState } from "../types/quiz.types";
import {
  filterArbeidsforhold,
  findArbeidstid,
  getPeriodeLength,
  sortArbeidsforhold,
} from "../utils/arbeidsforhold.utils";

describe("filterArbeidsforhold", () => {
  test("liste med 0 arbeidsforhold", () => {
    expect(filterArbeidsforhold([], 6)).toStrictEqual([]);
  });

  test("liste med 1 arbeidsforhold uten sluttdato", () => {
    const arbeidsforhold = [
      { id: "1", startdato: "2021-11-01", organisasjonsnavn: "Jeg jobber her AS" },
    ];
    expect(filterArbeidsforhold(arbeidsforhold, 6)).toStrictEqual(arbeidsforhold);
  });

  test("liste med 1 arbeidsforhold der sluttdato er for to måneder siden, og grense på 6 måneder", () => {
    const today = new Date();
    const twoMonthsAgo = subMonths(today, 2);
    // yyyy-mm-dd
    const sluttdato = twoMonthsAgo.toLocaleDateString("fr-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const arbeidsforhold = [
      { id: "1", startdato: "2021-11-01", sluttdato, organisasjonsnavn: "Jeg jobbet her AS" },
    ];
    expect(filterArbeidsforhold(arbeidsforhold, 6)).toStrictEqual(arbeidsforhold);
  });

  test("liste med 2 arbeidsforhold (1 innenfor og 1 utenfor grensa på 6 måneder)", () => {
    const today = new Date();
    const twoMonthsAgo = subMonths(today, 2);
    // yyyy-mm-dd
    const sluttdato = twoMonthsAgo.toLocaleDateString("fr-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const arbeidsforhold = [
      {
        id: "1",
        startdato: "2020-01-01",
        sluttdato: "2021-10-31",
        organisasjonsnavn: "Ingen jobber her AS",
      },
      { id: "1", startdato: "2021-11-01", sluttdato, organisasjonsnavn: "Jeg jobbet her AS" },
    ];
    expect(filterArbeidsforhold(arbeidsforhold, 6)).toStrictEqual([arbeidsforhold[1]]);
  });

  test("liste med 2 arbeidsforhold, der sluttdato er for åtte måneder siden og grense på 6 måneder", () => {
    const today = new Date();
    const eightMonthsAgo = subMonths(today, 8);
    // yyyy-mm-dd
    const sluttdato = eightMonthsAgo.toLocaleDateString("fr-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const arbeidsforhold = [
      {
        id: "1",
        startdato: "2020-01-01",
        sluttdato: "2021-10-31",
        organisasjonsnavn: "Ingen jobber her AS",
      },
      { id: "1", startdato: "2021-11-01", sluttdato, organisasjonsnavn: "Jeg jobbet her AS" },
    ];
    expect(filterArbeidsforhold(arbeidsforhold, 6)).toStrictEqual([]);
  });

  test("liste med arbeidsforhold, 1 med sluttdato for åtte måneder siden, og grense på 12 måneder", () => {
    const today = new Date();
    const eightMonthsAgo = subMonths(today, 8);
    // yyyy-mm-dd
    const sluttdato = eightMonthsAgo.toLocaleDateString("fr-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const arbeidsforhold = [
      {
        id: "1",
        startdato: "2020-01-01",
        sluttdato: "2021-10-31",
        organisasjonsnavn: "Ingen jobber her AS",
      },
      { id: "1", startdato: "2021-11-01", sluttdato, organisasjonsnavn: "Jeg jobbet her AS" },
    ];
    expect(filterArbeidsforhold(arbeidsforhold, 12)).toStrictEqual([arbeidsforhold[1]]);
  });
});

describe("getPeriodeLength", () => {
  test("arbeidsperiode er null", () => {
    expect(getPeriodeLength(null)).toBe(6);
  });

  test("faktum.type-arbeidstid.svar.fast", () => {
    expect(getPeriodeLength("faktum.type-arbeidstid.svar.fast")).toBe(6);
  });

  test("faktum.type-arbeidstid.svar.varierende", () => {
    expect(getPeriodeLength("faktum.type-arbeidstid.svar.varierende")).toBe(12);
  });

  test("faktum.type-arbeidstid.svar.kombinasjon", () => {
    expect(getPeriodeLength("faktum.type-arbeidstid.svar.kombinasjon")).toBe(12);
  });

  test("faktum.type-arbeidstid.svar.ingen-passer", () => {
    expect(getPeriodeLength("faktum.type-arbeidstid.svar.ingen-passer")).toBe(6);
  });
});

describe("findArbeidstid", () => {
  const soknadState: IQuizState = {
    ferdig: false,
    antallSeksjoner: 1,
    seksjoner: [
      {
        fakta: [
          {
            id: "107",
            svar: "faktum.type-arbeidstid.svar.fast",
            type: "envalg",
            roller: ["søker"],
            readOnly: false,
            gyldigeValg: [
              "faktum.type-arbeidstid.svar.fast",
              "faktum.type-arbeidstid.svar.varierende",
              "faktum.type-arbeidstid.svar.kombinasjon",
              "faktum.type-arbeidstid.svar.ingen-passer",
            ],
            beskrivendeId: "faktum.type-arbeidstid",
            sannsynliggjoresAv: [],
          },
        ],
        beskrivendeId: "din-situasjon",
        ferdig: false,
      },
    ],
  };

  test("tom state", () => {
    // @ts-ignore
    expect(findArbeidstid({})).toBe(null);
  });

  test("faktum.type-arbeidstid.svar.fast", () => {
    expect(findArbeidstid(soknadState)).toBe("faktum.type-arbeidstid.svar.fast");
  });

  test("soknadState uten seksjonen 'din-situasjon'", () => {
    // @ts-ignore
    expect(findArbeidstid({ seksjoner: [] })).toBe(null);
  });
});

describe("sortArbeidsforhold", () => {
  test("Bare aktive forhold, sorter på startdato", () => {
    const arbeidsforhold = [
      {
        id: "1",
        startdato: "2020-01-01",
        organisasjonsnavn: "Jeg startet her først",
      },
      {
        id: "2",
        startdato: "2023-01-01",
        organisasjonsnavn: "Jeg starter her sist",
      },
    ];

    const sortedArbeidsforhold = sortArbeidsforhold(arbeidsforhold);
    expect(sortedArbeidsforhold).toStrictEqual([...arbeidsforhold].reverse());
  });

  test("Første forhold er  aktivt", () => {
    const arbeidsforhold = [
      {
        id: "2",
        startdato: "2023-01-01",
        organisasjonsnavn: "Jeg jobber her",
      },
      {
        id: "3",
        startdato: "2020-01-01",
        sluttdato: "2022-12-31",
        organisasjonsnavn: "Jeg slutta her",
      },
    ];

    const sortedArbeidsforhold = sortArbeidsforhold(arbeidsforhold);
    expect(sortedArbeidsforhold).toStrictEqual([...arbeidsforhold]);
  });

  test("Andre forhold er  aktivt", () => {
    const arbeidsforhold = [
      {
        id: "2",
        startdato: "2023-01-01",
        sluttdato: "2022-12-31",
        organisasjonsnavn: "Jeg jobber her",
      },
      {
        id: "3",
        startdato: "2020-01-01",
        organisasjonsnavn: "Jeg slutta her",
      },
    ];

    const sortedArbeidsforhold = sortArbeidsforhold(arbeidsforhold);
    expect(sortedArbeidsforhold).toStrictEqual([...arbeidsforhold].reverse());
  });

  test("Ingen aktive forhold", () => {
    const arbeidsforhold = [
      {
        id: "2",
        startdato: "2023-01-01",
        sluttdato: "2023-10-31",
        organisasjonsnavn: "Jeg slutta her sist",
      },
      {
        id: "3",
        startdato: "2020-01-01",
        sluttdato: "2023-06-03",
        organisasjonsnavn: "Jeg slutta her først",
      },
    ];

    const sortedArbeidsforhold = sortArbeidsforhold(arbeidsforhold);
    expect(sortedArbeidsforhold).toStrictEqual([...arbeidsforhold].reverse());
  });
});
