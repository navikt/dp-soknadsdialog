/**
 * @jest-environment node
 */

import { createMocks } from "node-mocks-http";
import { mockGetSession } from "../../../../__mocks__/mockGetSession";
import fetch from "jest-fetch-mock";
import deleteHandler, { IDeleteSoknadBody } from "../../../../pages/api/soknad/delete";

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

const deleteSoknadMockdata: IDeleteSoknadBody = {
  uuid: "1234",
};

describe("/api/soknad/delete", () => {
  test("Should delete an application", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: true }), { status: 200 }] // Delete from dp-soknad
    );

    const { req, res } = createMocks({
      method: "DELETE",
      body: deleteSoknadMockdata,
    });

    await deleteHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual("OK");
  });

  test("Should return error if deleting the application fails", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: false }), { status: 500 }] // Delete application from dp-soknad
    );

    const { req, res } = createMocks({
      method: "DELETE",
      body: deleteSoknadMockdata,
    });

    await deleteHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toEqual("Internal Server Error");
  });
});
