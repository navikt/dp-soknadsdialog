import React from "react";
import fetch from "jest-fetch-mock";
import userEvent from "@testing-library/user-event";
import { Modal } from "@navikt/ds-react";
import { render, screen, waitFor } from "@testing-library/react";
import { SanityProvider } from "../../context/sanity-context";
import { mockDokumentkravList } from "../../__mocks__/mockdata/dokumentkrav-list";
import { DokumentkravBundleErrorModal } from "./DokumentkravBundleErrorModal";
import { IDokumentkrav } from "../../types/documentation.types";
import { mockSanityTexts } from "../../__mocks__/MockContext";

describe("DokumentkravBundleErrorModal", () => {
  beforeAll(() => {
    const app = document.createElement("div");
    app.id = "__next";

    document.getElementsByTagName("body").item(0)?.appendChild(app);

    // @ts-ignore:next-line
    Modal.setAppElement("#__next");
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
