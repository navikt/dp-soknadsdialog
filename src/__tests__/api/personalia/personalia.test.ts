import { createMocks } from "node-mocks-http";
import { HttpProblem, personaliaHandler } from "../../../pages/api/personalia";
import { getSession as _getSession } from "@navikt/dp-auth/server";
import { Personalia } from "../../../types/personalia.types";

jest.mock("@navikt/dp-auth/server");
const getSession = _getSession as jest.MockedFunction<typeof _getSession>;

global.fetch = jest.fn(() => {
  return Promise.resolve({
    headers: new Headers({ "content-type": "application/json" }),
    ok: true,
    json: () =>
      Promise.resolve<Personalia>({
        forNavn: "Donald",
        mellomNavn: "J",
        etterNavn: "Trumpf",
        fødselsDato: new Date("1940-06-14"),
        kontonummer: "12345677889",
        bankLandkode: "SWE",
        banknavn: "Eskilstuna Rekarne Sparbank",
        folkeregistrertAdresse: {
          adresselinje1: "Soloveien 232",
          adresselinje2: "C/O Plassen",
          adresselinje3: "Bortafor vegen",
          byEllerStedsnavn: "SOL",
          landkode: "SWE",
          land: "Sverige",
          postkode: "1121",
        },
        postAdresse: {
          adresselinje1: "Soloveien 232",
          adresselinje2: "C/O Plassen",
          adresselinje3: "Bortafor vegen",
          byEllerStedsnavn: "SOL",
          landkode: "SWE",
          land: "Sverige",
          postkode: "1121",
        },
      }),
  });
}) as jest.Mock;

beforeEach(() => {
  getSession.mockResolvedValue({
    token: "123",
    payload: { pid: "123123", exp: Date.now() / 1000 + 3000 },
    apiToken: async () => "foo",
  });
});
afterEach(() => {
  getSession.mockClear();
  (fetch as jest.Mock).mockClear();
});

describe("/api/personalia", () => {
  test("svarer med personalia", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    // @ts-ignore MockRequest matcher ikke AuthedNextApiRequest
    await personaliaHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchSnapshot();
  });

  test("ved feil", async () => {
    // @ts-ignore Vet ikke hvordan en gjør det i ts
    fetch.mockImplementationOnce(() => Promise.reject("API is down"));
    const { req, res } = createMocks({
      method: "GET",
    });

    // @ts-ignore MockRequest matcher ikke AuthedNextApiRequest
    await personaliaHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
  });

  test("APIet svarer med annen enn 200 ok", async () => {
    // @ts-ignore Vet ikke hvordan en gjør det i ts
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        headers: new Headers({ "content-type": "application/json" }),
        status: 400,
        ok: false,
        json: () =>
          Promise.resolve<HttpProblem>({
            detail: "En lengre beskrivelse av hvorfor det feiler",
            status: 400,
            title: "Feil token",
            type: new URL("urn:oppslag:personalia"),
          }),
      })
    );
    const { req, res } = createMocks({
      method: "GET",
    });

    // @ts-ignore MockRequest matcher ikke AuthedNextApiRequest
    await personaliaHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchSnapshot();
  });

  test("Uinnlogget", async () => {
    // @ts-ignore Vet ikke hvordan en gjør det i ts
    getSession.mockResolvedValue({});
    const { req, res } = createMocks({
      method: "GET",
    });

    // @ts-ignore MockRequest matcher ikke AuthedNextApiRequest
    await personaliaHandler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toMatchSnapshot();
  });
});
