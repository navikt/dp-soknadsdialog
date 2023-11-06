/**
 * @jest-environment node
 */

import fetch from "jest-fetch-mock";
import { createMocks } from "node-mocks-http";
import { mockGetSession, mockGetOnBehalfOfToken } from "../../../../__mocks__/mockGetSession";
import uuidHandler from "../../../../pages/api/soknad/uuid";

jest.mock("../../../../auth.utils", () => ({
  getSession: () => mockGetSession(),
  getSoknadOnBehalfOfToken: () => mockGetOnBehalfOfToken(),
}));

beforeEach(() => {
  fetch.enableMocks();
});

afterEach(() => {
  fetch.mockReset();
});

describe("/api/soknad/uuid", () => {
  test("Should get a new uuid to start an application", async () => {
    fetch.mockResponses(
      ["12345", { status: 200 }] // Response from dp-soknad
    );

    const { req, res } = createMocks({
      method: "POST",
    });

    await uuidHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual("12345");
  });

  test("Should return error if getting a new uuid fails", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: false }), { status: 500 }] // Response from dp-soknad on error
    );

    const { req, res } = createMocks({
      method: "POST",
    });

    await uuidHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toEqual("Internal Server Error");
  });
});
