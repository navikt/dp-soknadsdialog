/**
 * @jest-environment node
 */

import { createMocks } from "node-mocks-http";
import { mockGetSession } from "../../../../__mocks__/mockGetSession";
import fetch from "jest-fetch-mock";
import ettersendHandler, { IEttersendBody } from "../../../../pages/api/soknad/ettersend";

jest.mock("../../../../auth.utils", () => ({
  getSession: () => mockGetSession(),
}));

jest.mock("@navikt/next-logger");

beforeEach(() => {
  fetch.enableMocks();
});

afterEach(() => {
  fetch.mockReset();
});

const ettersendMockdata: IEttersendBody = {
  uuid: "1234",
};

describe("/api/soknad/ettersend", () => {
  test("Should trigger an ettersending on a soknad", async () => {
    fetch.mockResponses(
      ["", { status: 201 }] // Response from dp-soknad
    );

    const { req, res } = createMocks({
      method: "PUT",
      body: ettersendMockdata,
    });

    await ettersendHandler(req, res);

    expect(res._getStatusCode()).toBe(201);
  });

  test("Should return error if sending in the application fails", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: false }), { status: 500 }] // Response from dp-soknad on error
    );

    const { req, res } = createMocks({
      method: "PUT",
      body: ettersendMockdata,
    });

    await ettersendHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toEqual("Internal Server Error");
  });
});
