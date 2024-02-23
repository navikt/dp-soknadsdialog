/**
 * @jest-environment node
 */

import { createMocks } from "node-mocks-http";
import { mockGetOnBehalfOfToken } from "../../../../__mocks__/mockGetSession";
import createFetchMock from "vitest-fetch-mock";
import uuidHandler from "../../../../pages/api/soknad/uuid";

vi.mock("../../../../utils/auth.utils", () => ({
  getSoknadOnBehalfOfToken: () => mockGetOnBehalfOfToken(),
}));

const fetch = createFetchMock(vi);

beforeEach(() => {
  fetch.enableMocks();
});

afterEach(() => {
  fetch.resetMocks();
});

describe("/api/soknad/uuid", () => {
  test("Should get a new uuid to start an application", async () => {
    fetch.mockResponses(
      ["12345", { status: 200 }] // Response from dp-soknad
    );

    const { req, res } = createMocks({
      method: "POST",
    });

    // @ts-ignore
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

    // @ts-ignore
    await uuidHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toEqual("Internal Server Error");
  });
});
