import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import fetch from "jest-fetch-mock";
import { mockSanityTexts } from "../../__mocks__/MockContext";
import { SanityProvider } from "../../context/sanity-context";
import { mockDokumentkravList } from "../../localhost-data/dokumentkrav-list";
import { IDokumentkrav } from "../../types/documentation.types";
import { DokumentkravBundleErrorModal } from "./DokumentkravBundleErrorModal";

describe("DokumentkravBundleErrorModal", () => {
  beforeAll(() => {
    const app = document.createElement("div");
    app.id = "__next";

    document.getElementsByTagName("body").item(0)?.appendChild(app);
  });

  beforeEach(() => {
    fetch.enableMocks();
  });

  afterEach(() => {
    fetch.mockReset();
  });

  test("Should show which dokumentkrav has bundle errors", async () => {
    const bundleErrorList: IDokumentkrav[] = [mockDokumentkravList.krav[0]];

    render(
      <SanityProvider initialState={mockSanityTexts}>
        <DokumentkravBundleErrorModal
          dokumentkravList={bundleErrorList}
          isOpen={true}
          toggleVisibility={() => ""}
        />
      </SanityProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText(mockDokumentkravList.krav[0].beskrivendeId, {
          exact: false,
        })
      ).toBeInTheDocument();
    });
  });

  test("Should post answer 'send later' if the user agrees to the fallback solution", async () => {
    const user = userEvent.setup();
    const bundleErrorList = [mockDokumentkravList.krav[0]];

    // Post answer "send later"
    fetch.mockResponseOnce(
      JSON.stringify({
        ok: true,
      })
    );

    render(
      <SanityProvider initialState={mockSanityTexts}>
        <DokumentkravBundleErrorModal
          dokumentkravList={bundleErrorList}
          isOpen={true}
          toggleVisibility={() => ""}
        />{" "}
      </SanityProvider>
    );

    await user.click(screen.getByText("dokumentkrav.bundle-error-modal.knapp.send-senere"));

    const deleteRequestBody = fetch.mock.calls[0][1]?.body as string;
    const requestJson = JSON.parse(deleteRequestBody);

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][1]?.method).toEqual("PUT");
    expect(fetch.mock.calls[0][0]).toContain("api/documentation/svar");

    expect(requestJson.dokumentkravSvar.svar).toBe("dokumentkrav.svar.send.senere");
    expect(requestJson.dokumentkravSvar.begrunnelse).toBe("Teknisk feil på innsending av filer");
  });
});
