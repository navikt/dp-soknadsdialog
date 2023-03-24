/**
 * @jest-environment node
 */

import { createMocks } from "node-mocks-http";
import { mockGetSession } from "../../../../../__mocks__/mockGetSession";
import fetch from "jest-fetch-mock";
import dokumentkravHandler from "../../../../../pages/api/documentation/[uuid]/index";
import { mockDokumentkravList } from "../../../../../__mocks__/mockdata/dokumentkrav-list";

jest.mock("../../../../../auth.utils", () => ({
  getSession: () => mockGetSession(),
}));

jest.mock("@navikt/next-logger");

beforeEach(() => {
  fetch.enableMocks();
});

afterEach(() => {
  fetch.mockReset();
});

describe("/api/documentation/[uuid]/index", () => {
  test("Should get a list of dokumentkrav", async () => {
    fetch.mockResponses(
      [JSON.stringify(mockDokumentkravList), { status: 200 }] // Get a list of dokumentkrav from dp-soknad
    );

    const { req, res } = createMocks({
      method: "GET",
    });

    await dokumentkravHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual(mockDokumentkravList);
  });

  test("Should return error if getting the list of dokumentkrav fails", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: false }), { status: 500 }] // Get a list of dokumentkrav from dp-soknad
    );

    const { req, res } = createMocks({
      method: "GET",
    });

    await dokumentkravHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toEqual("Internal Server Error");
  });
});
