/**
 * @jest-environment node
 */

import { createMocks } from "node-mocks-http";
import deleteFileHandler, {
  IDeleteFileBody,
} from "../../../../../pages/api/documentation/file/delete";
import { mockGetSession, mockGetOnBehalfOfToken } from "../../../../../__mocks__/mockGetSession";
import fetch from "jest-fetch-mock";

jest.mock("../../../../../auth.utils", () => ({
  getSession: () => mockGetSession(),
  getSoknadOnBehalfOfToken: () => mockGetOnBehalfOfToken(),
  getMellomlagringOnBehalfOfToken: () => mockGetOnBehalfOfToken(),
}));

beforeEach(() => {
  fetch.enableMocks();
});

afterEach(() => {
  fetch.mockReset();
});

const deleteFileMockData: IDeleteFileBody = {
  uuid: "1234",
  dokumentkravId: "5678",
  filsti: "soknad-uuid/faktumId/file-id-1",
};

describe("/api/documentation/file/delete", () => {
  test("Should delete a documentation file", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: true }), { status: 200 }], // Delete file from dp-soknad
      [JSON.stringify({ ok: true }), { status: 200 }] // Delete file from dp-mellomlagring
    );

    const { req, res } = createMocks({
      method: "DELETE",
      body: deleteFileMockData,
    });

    await deleteFileHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual("OK");
  });

  test("Should return error if deleting the file from dp-soknad fails", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: false }), { status: 500 }] // Delete file from dp-soknad
    );

    const { req, res } = createMocks({
      method: "DELETE",
      body: deleteFileMockData,
    });

    await deleteFileHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toEqual("Internal Server Error");
  });

  test("Should return 200 OK if deleting the file from dp-mellomlagring fails, but dp-soknad works", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: true }), { status: 200 }], // Delete file from dp-soknad
      [JSON.stringify({ status: 500, statusText: "Something bad happened" }), { status: 500 }] // Delete file from dp-mellomlagring
    );

    const { req, res } = createMocks({
      method: "DELETE",
      body: deleteFileMockData,
    });

    await deleteFileHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual("OK");
  });
});
