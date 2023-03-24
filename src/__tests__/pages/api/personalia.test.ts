/**
 * @jest-environment node
 */

import { createMocks } from "node-mocks-http";
import { mockGetSession } from "../../../__mocks__/mockGetSession";
import fetch from "jest-fetch-mock";
import personaliaHandler from "../../../pages/api/personalia";
import { mockPersonalia } from "../../../__mocks__/mockdata/personalia";

jest.mock("../../../auth.utils", () => ({
  getSession: () => mockGetSession(),
}));

jest.mock("@navikt/next-logger");

beforeEach(() => {
  fetch.enableMocks();
});

afterEach(() => {
  fetch.mockReset();
});

describe("/api/personalia", () => {
  test("Should get the user personalia", async () => {
    fetch.mockResponses(
      [JSON.stringify(mockPersonalia), { status: 200 }] // Response from dp-soknad
    );

    const { req, res } = createMocks({
      method: "GET",
    });

    await personaliaHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual(JSON.stringify(mockPersonalia));
  });

  test("Should return error if getting personalia fails", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: false }), { status: 500 }] // Response from dp-soknad on error
    );

    const { req, res } = createMocks({
      method: "GET",
    });

    await personaliaHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toEqual("Internal Server Error");
  });
});
