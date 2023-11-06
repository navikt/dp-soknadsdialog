/**
 * @jest-environment node
 */

import { createMocks } from "node-mocks-http";
import saveFaktumHandler, { ISaveFaktumBody } from "../../../../../pages/api/soknad/faktum/save";
import fetch from "jest-fetch-mock";
import { QuizFaktum } from "../../../../../types/quiz.types";
import { mockNeste } from "../../../../../localhost-data/mock-neste";
import { mockGetSession, mockGetOnBehalfOfToken } from "../../../../../__mocks__/mockGetSession";

jest.mock("../../../../../auth.utils", () => ({
  getSession: () => mockGetSession(),
  getSoknadOnBehalfOfToken: () => mockGetOnBehalfOfToken(),
}));

beforeEach(() => {
  fetch.enableMocks();
});

afterEach(() => {
  fetch.mockReset();
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
  uuid: "1234",
};

describe("/api/soknad/faktum/save", () => {
  test("Should post answer and get new application state back", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: true }), { status: 200 }], // Post answer "send later"
      [JSON.stringify(mockNeste), { status: 200 }] // Fetch new application state
    );

    const { req, res } = createMocks({
      method: "PUT",
      body: saveFaktumMockData,
    });

    await saveFaktumHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual(mockNeste);
  });

  test("Should return error if answering the question fails", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: false }), { status: 500 }], // Post answer "send later"
      [JSON.stringify(mockNeste), { status: 200 }] // Fetch new application state
    );

    const { req, res } = createMocks({
      method: "PUT",
      body: saveFaktumMockData,
    });

    await saveFaktumHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toEqual("Internal Server Error");
  });

  test("Should return error if getting the new application state fails", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: true }), { status: 200 }], // Post answer "send later"
      [JSON.stringify({ status: 500, statusText: "Something bad happened" }), { status: 500 }] // Fetch new application state
    );

    const { req, res } = createMocks({
      method: "PUT",
      body: saveFaktumMockData,
    });

    await saveFaktumHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toEqual("Internal Server Error");
  });
});
