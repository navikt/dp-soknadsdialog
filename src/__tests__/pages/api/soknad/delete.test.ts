/**
 * @jest-environment node
 */
// Test lint-staged prettier list-different

import { createMocks } from "node-mocks-http";
import { mockGetOnBehalfOfToken, mockGetSession } from "../../../../__mocks__/mockGetSession";
import createFetchMock from "vitest-fetch-mock";
import deleteHandler, { IDeleteSoknadBody } from "../../../../pages/api/soknad/delete";

vi.mock("../../../../auth.utils", () => ({
  getSession: () => mockGetSession(),
  getSoknadOnBehalfOfToken: () => mockGetOnBehalfOfToken(),
}));

const fetch = createFetchMock(vi);

beforeEach(() => {
  fetch.enableMocks();
});

afterEach(() => {
  fetch.resetMocks();
});
const deleteSoknadMockdata: IDeleteSoknadBody = {
  uuid: "1234",
};

describe("/api/soknad/delete", () => {
  test("Should delete an application", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: true }), { status: 200 }], // Delete from dp-soknad
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
      [JSON.stringify({ ok: false }), { status: 500 }], // Delete application from dp-soknad
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
