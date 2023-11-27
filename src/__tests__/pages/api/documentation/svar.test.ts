/**
 * @jest-environment node
 */

import { createMocks } from "node-mocks-http";
import { mockGetSession } from "../../../../__mocks__/mockGetSession";
import createFetchMock from "vitest-fetch-mock";
import svarHandler, { IDokumentkravSvarBody } from "../../../../pages/api/documentation/svar";
import { DOKUMENTKRAV_SVAR_SEND_NAA } from "../../../../constants";
import { mockDokumentkravList } from "../../../../localhost-data/dokumentkrav-list";

vi.mock("../../../../auth.utils", () => ({
  getSession: () => mockGetSession(),
  getSoknadOnBehalfOfToken: () => mockGetOnBehalfOfToken(),
  getMellomlagringOnBehalfOfToken: () => mockGetOnBehalfOfToken(),
}));

const fetch = createFetchMock(vi);

beforeEach(() => {
  fetch.enableMocks();
});

afterEach(() => {
  fetch.resetMocks();
});

const dokumentkravSvarMockdata: IDokumentkravSvarBody = {
  uuid: "1234",
  dokumentkravId: "5678",
  dokumentkravSvar: {
    svar: DOKUMENTKRAV_SVAR_SEND_NAA,
    begrunnelse: "",
  },
};

describe("/api/documentation/svar", () => {
  test("Should post a dokumentkrav svar", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: true }), { status: 200 }], // Post the answer to dp-soknad
      [JSON.stringify(mockDokumentkravList), { status: 200 }] // Get new state on all dokumentkrav from dp-soknad
    );

    const { req, res } = createMocks({
      method: "PUT",
      body: dokumentkravSvarMockdata,
    });

    await svarHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual(mockDokumentkravList);
  });

  test("Should return error if posting the answer to dp-soknad fails", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: false }), { status: 500 }], // Post the answer to dp-soknad
      [JSON.stringify(mockDokumentkravList), { status: 200 }] // Get new state on all dokumentkrav from dp-soknad
    );

    const { req, res } = createMocks({
      method: "PUT",
      body: dokumentkravSvarMockdata,
    });

    await svarHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toEqual("Internal Server Error");
  });

  test("Should return 200 OK if getting the new dokumentkrav state fails after posting the answer", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: true }), { status: 200 }], // Post the answer to dp-soknad
      [JSON.stringify({ status: 500, statusText: "Something bad happened" }), { status: 500 }] // Get the new state on all dokumentkrav from dp-soknad
    );

    const { req, res } = createMocks({
      method: "PUT",
      body: dokumentkravSvarMockdata,
    });

    await svarHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual("OK");
  });
});
