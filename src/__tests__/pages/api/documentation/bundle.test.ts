/**
 * @jest-environment node
 */

import { createMocks } from "node-mocks-http";
import { mockGetOnBehalfOfToken, mockGetSession } from "../../../../__mocks__/mockGetSession";
import createFetchMock from "vitest-fetch-mock";
import bundleHandler, {
  IDocumentationBundleBody,
} from "../../../../pages/api/documentation/bundle";

vi.mock("../../../../utils/auth.utils", () => ({
  getSession: () => mockGetSession(),
  getSoknadOnBehalfOfToken: () => mockGetOnBehalfOfToken(),
  getMellomlagringOnBehalfOfToken: () => mockGetOnBehalfOfToken(),
}));

vi.mock("@navikt/next-logger");

const fetch = createFetchMock(vi);

beforeEach(() => {
  fetch.enableMocks();
});

afterEach(() => {
  fetch.resetMocks();
});
const dokumentkravBundleMockData: IDocumentationBundleBody = {
  uuid: "1234",
  dokumentkravId: "5678",
  fileUrns: [
    {
      urn: "urn:vedlegg:623c03ba-ea07-44ba-90a2-f556246fedd7/7002/2c0d217f-eb25-49f2-88c7-0f3d2b19a042",
    },
  ],
};

describe("/api/documentation/bundle", () => {
  test("Should trigger bundle on a dokumentkrav", async () => {
    fetch.mockResponses(
      [
        JSON.stringify({
          urn: "urn:vedlegg:623c03ba-ea07-44ba-90a2-f556246fedd7/7002/2c0d217f-eb25-49f2-88c7-1q2345",
          storrelse: 12344,
        }),
        { status: 200 },
      ], // Post the file urns to dp-mellomlagring
      [JSON.stringify({ ok: true }), { status: 201 }], // Post the new bundle urn to dp-soknad
    );

    const { req, res } = createMocks({
      method: "PUT",
      body: dokumentkravBundleMockData,
    });

    await bundleHandler(req, res);

    expect(res._getStatusCode()).toBe(201);
  });

  test("Should return error if posting the answer to dp-mellomlagring fails", async () => {
    fetch.mockResponses(
      [JSON.stringify({ ok: false }), { status: 500 }], // Post the file urns to dp-mellomlagring
    );

    const { req, res } = createMocks({
      method: "PUT",
      body: dokumentkravBundleMockData,
    });

    await bundleHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toEqual("Internal Server Error");
  });

  test("Should return error if posting the answer to dp-soknad fails", async () => {
    fetch.mockResponses(
      [
        JSON.stringify({
          urn: "urn:vedlegg:623c03ba-ea07-44ba-90a2-f556246fedd7/7002/2c0d217f-eb25-49f2-88c7-1q2345",
          storrelse: 12344,
        }),
        { status: 200 },
      ], // Post the file urns to dp-mellomlagring
      [JSON.stringify({ ok: false }), { status: 500 }], // Post the new bundle urn to dp-soknad
    );

    const { req, res } = createMocks({
      method: "PUT",
      body: dokumentkravBundleMockData,
    });

    await bundleHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toEqual("Internal Server Error");
  });
});
