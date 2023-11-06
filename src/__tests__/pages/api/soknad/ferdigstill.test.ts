/**
 * @jest-environment node
 */

import { createMocks } from "node-mocks-http";
import { mockGetSession, mockOnBehalfOfToken } from "../../../../__mocks__/mockGetSession";
import fetch from "jest-fetch-mock";
import ferdigstillHandler, { IFerdigstillBody } from "../../../../pages/api/soknad/ferdigstill";
import { mockSanityTexts } from "../../../../__mocks__/MockContext";

jest.mock("../../../../auth.utils", () => ({
  getSession: () => mockGetSession(),
  getSoknadOnBehalfOfToken: () => mockOnBehalfOfToken(),
}));

jest.mock("../../../../../sanity-client", () => ({
  sanityClient: {
    fetch: () => Promise.resolve(mockSanityTexts),
  },
}));

beforeEach(() => {
  fetch.enableMocks();
});

afterEach(() => {
  fetch.mockReset();
});

const ferdigstillMockData: IFerdigstillBody = {
  uuid: "1234",
  locale: "nb",
};

describe("/api/soknad/ferdigstill", () => {
  test("Should send an application", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: true }), { status: 200 }] // Response from dp-soknad
    );

    const { req, res } = createMocks({
      method: "PUT",
      body: ferdigstillMockData,
    });

    await ferdigstillHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual("OK");
  });

  test("Should return error if sending in the application fails", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: false }), { status: 500 }] // Response from dp-soknad on error
    );

    const { req, res } = createMocks({
      method: "PUT",
      body: ferdigstillMockData,
    });

    await ferdigstillHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toEqual("Internal Server Error");
  });
});
