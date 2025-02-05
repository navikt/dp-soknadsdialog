import { createMocks } from "node-mocks-http";
import saveFaktumHandler, { ISaveFaktumBody } from "../../../../../pages/api/soknad/faktum/save";
import createFetchMock from "vitest-fetch-mock";
import { QuizFaktum } from "../../../../../types/quiz.types";
import { mockNeste } from "../../../../../localhost-data/mock-neste";
import { mockGetOnBehalfOfToken } from "../../../../../__mocks__/mockGetSession";
import { UUID_REGEX } from "../../../../../constants";

vi.mock("../../../../../utils/auth.utils", () => ({
  getSoknadOnBehalfOfToken: () => mockGetOnBehalfOfToken(),
}));

const fetch = createFetchMock(vi);

beforeEach(() => {
  fetch.enableMocks();
});

afterEach(() => {
  fetch.resetMocks();
});

const faktumMockData: QuizFaktum = {
  id: "10001",
  svar: "faktum.mottatt-dagpenger-siste-12-mnd.svar.nei",
  type: "envalg",
  readOnly: false,
  gyldigeValg: [
    "faktum.mottatt-dagpenger-siste-12-mnd.svar.ja",
    "faktum.mottatt-dagpenger-siste-12-mnd.svar.nei",
    "faktum.mottatt-dagpenger-siste-12-mnd.svar.vet-ikke",
  ],
  beskrivendeId: "faktum.mottatt-dagpenger-siste-12-mnd",
  sannsynliggjoresAv: [],
  roller: [],
};

const saveFaktumMockData: ISaveFaktumBody = {
  faktum: faktumMockData,
  svar: faktumMockData.gyldigeValg[0],
  uuid: "ce035d7f-c2a7-4954-a103-60402bdf69ac",
};

describe("/api/soknad/faktum/save", () => {
  test("Should post answer and get new application state back", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: true }), { status: 200 }], // Post answer "send later"
      [JSON.stringify(mockNeste), { status: 200 }], // Fetch new application state
    );

    const { req, res } = createMocks({
      method: "PUT",
      body: saveFaktumMockData,
    });

    // @ts-ignore
    await saveFaktumHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual(mockNeste);
  });

  test("Should return error if answering the question fails", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: false }), { status: 500 }], // Post answer "send later"
      [JSON.stringify(mockNeste), { status: 200 }], // Fetch new application state
    );

    const { req, res } = createMocks({
      method: "PUT",
      body: saveFaktumMockData,
    });

    // @ts-ignore
    await saveFaktumHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toEqual("Internal Server Error");
  });

  test("Should return error if getting the new application state fails", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: true }), { status: 200 }], // Post answer "send later"
      [JSON.stringify({ status: 500, statusText: "Something bad happened" }), { status: 500 }], // Fetch new application state
    );

    const { req, res } = createMocks({
      method: "PUT",
      body: saveFaktumMockData,
    });

    // @ts-ignore
    await saveFaktumHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toEqual("Internal Server Error");
  });

  test("Validate UUID when saving to quiz", async () => {
    expect(UUID_REGEX.test("1234")).toBe(false);
    expect(UUID_REGEX.test("add61e0d-2a19-43fd-9eb8-62393d7cadbb")).toBe(true);
    expect(UUID_REGEX.test("add61e0d-2a19-43fd-9eb8-62393d7cadbø")).toBe(false);
    expect(UUID_REGEX.test("add61e0d--2a19-43fd-9eb8-62393d7cadbb")).toBe(false);
    expect(UUID_REGEX.test("add61e0d--2a19-43fd-9eb8---aaa")).toBe(false);
  });

  test("Should get 400 error if uuid format is invalid when saving to quiz", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: true }), { status: 200 }], // Post answer "send later"
      [JSON.stringify(mockNeste), { status: 200 }], // Fetch new application state
    );

    const saveFaktumMockDataWithInvalidUUid = {
      ...faktumMockData,
      uuid: "1234-test",
    };

    const { req, res } = createMocks({
      method: "PUT",
      body: saveFaktumMockDataWithInvalidUUid,
    });

    // @ts-ignore
    await saveFaktumHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
  });
});
