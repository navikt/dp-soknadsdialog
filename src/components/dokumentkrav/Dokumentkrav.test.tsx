import React from "react";
import {
  render,
  waitFor,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dokumentkrav } from "./Dokumentkrav";
import { SanityProvider } from "../../context/sanity-context";
import { DOKUMENTKRAV_SVAR_SEND_NAA } from "../../constants";
import { sanityMocks } from "../../__mocks__/sanity.mocks";
import { mockDokumentkravList } from "../../localhost-data/dokumentkrav-list";
import fetch from "jest-fetch-mock";

describe("Dokumentkrav", () => {
  test("Should show dokumentkrav title", async () => {
    render(
      <SanityProvider initialState={sanityMocks}>
        <Dokumentkrav dokumentkrav={mockDokumentkravList.krav[0]} onChange={() => ""} />
      </SanityProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole("heading")).toHaveTextContent(
        mockDokumentkravList.krav[0].beskrivendeId
      );
    });
  });

  test("Should show dokumentkrav title and employer name for arbeidsforhold dokumentkrav", async () => {
    render(
      <SanityProvider initialState={sanityMocks}>
        <Dokumentkrav dokumentkrav={mockDokumentkravList.krav[0]} onChange={() => ""} />
      </SanityProvider>
    );

    await waitFor(() => {
      const dokumentkravTitle = `${mockDokumentkravList.krav[0].beskrivendeId} (${mockDokumentkravList.krav[0].fakta[0].svar})`;
      expect(screen.getByRole("heading")).toHaveTextContent(dokumentkravTitle);
    });
  });

  test("Should show upload component when question has a specific answer", async () => {
    const user = userEvent.setup();

    render(
      <SanityProvider initialState={sanityMocks}>
        <Dokumentkrav dokumentkrav={mockDokumentkravList.krav[0]} onChange={() => ""} />
      </SanityProvider>
    );

    await user.click(screen.getByLabelText(DOKUMENTKRAV_SVAR_SEND_NAA));

    await waitFor(() => {
      expect(screen.queryByText("filopplaster.dra.filene.hit")).toBeInTheDocument();
    });
  });

  test("Should show already uploaded files when showing upload component", async () => {
    const user = userEvent.setup();

    render(
      <SanityProvider initialState={sanityMocks}>
        <Dokumentkrav dokumentkrav={mockDokumentkravList.krav[0]} onChange={() => ""} />
      </SanityProvider>
    );

    await user.click(screen.getByLabelText(DOKUMENTKRAV_SVAR_SEND_NAA));

    await waitFor(() => {
      expect(screen.queryByText(mockDokumentkravList.krav[0].filer[0].filnavn)).toBeInTheDocument();
      expect(screen.queryByText(mockDokumentkravList.krav[0].filer[1].filnavn)).toBeInTheDocument();
    });
  });

  test("Should show additional input field begrunnelse if user chooses not to upload documentation", async () => {
    const user = userEvent.setup();

    render(
      <SanityProvider initialState={sanityMocks}>
        <Dokumentkrav dokumentkrav={mockDokumentkravList.krav[0]} onChange={() => ""} />
      </SanityProvider>
    );

    await user.click(screen.getByLabelText("dokumentkrav.svar.sender.ikke"));

    await waitFor(() => {
      expect(
        screen.getByLabelText("dokumentkrav.svar.sender.ikke.begrunnelse")
      ).toBeInTheDocument();
    });
  });

  describe("Upload file", () => {
    beforeEach(() => {
      fetch.enableMocks();
    });

    afterEach(() => {
      fetch.mockReset();
    });

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    function simulateFileUpload(screen: any, array: File[]) {
      const inputEl = screen.getByTestId("dropzone");

      Object.defineProperty(inputEl, "files", {
        value: array,
      });

      fireEvent.drop(inputEl);
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    async function simulateNavigateToUpload(user: any, screen: any) {
      await user.click(screen.getByLabelText(DOKUMENTKRAV_SVAR_SEND_NAA));

      await waitFor(() => {
        expect(screen.queryByText("filopplaster.dra.filene.hit")).toBeInTheDocument();
      });
    }

    describe("When user selects a valid file to upload", () => {
      beforeEach(() => {
        fetch.mockResponse(
          JSON.stringify({
            ok: true,
            urn: "1234",
            filnavn: "image.jpg",
          })
        );
      });

      it("Should show the file after upload", async () => {
        const user = userEvent.setup();

        render(
          <SanityProvider initialState={sanityMocks}>
            <Dokumentkrav dokumentkrav={mockDokumentkravList.krav[0]} onChange={() => ""} />
          </SanityProvider>
        );

        const file = new File(["file"], "image.jpg", {
          type: "image/jpg",
        });

        await simulateNavigateToUpload(user, screen);

        simulateFileUpload(screen, [file]);

        expect(await screen.findByText(file.name)).toBeInTheDocument();

        await waitFor(() => {
          expect(fetch.mock.calls.length).toEqual(1);
        });
      });
    });

    it("Should show info on invalid files, and not upload anything", async () => {
      const user = userEvent.setup();

      render(
        <SanityProvider initialState={sanityMocks}>
          <Dokumentkrav dokumentkrav={mockDokumentkravList.krav[0]} onChange={() => ""} />
        </SanityProvider>
      );

      const file = new File(["file"], "image.json", {
        type: "application/json",
      });

      await simulateNavigateToUpload(user, screen);

      simulateFileUpload(screen, [file]);

      expect(await screen.findByText(file.name)).toBeInTheDocument();
      expect(
        await screen.findByText("filopplaster.feil.beskrivelse-format-storrelse")
      ).toBeInTheDocument();

      expect(fetch.mock.calls.length).toEqual(0);
    });
  });
  describe("Delete uploaded file", () => {
    beforeEach(() => {
      fetch.enableMocks();
    });

    afterEach(() => {
      fetch.mockReset();
    });

    it("Should delete an uploaded file and remove it from the view", async () => {
      const fileToTest = mockDokumentkravList.krav[0].filer[0];

      // Request to delete file
      fetch.mockResponseOnce(
        JSON.stringify({
          ok: true,
        })
      );

      const user = userEvent.setup();

      render(
        <SanityProvider initialState={sanityMocks}>
          <Dokumentkrav dokumentkrav={mockDokumentkravList.krav[0]} onChange={() => ""} />
        </SanityProvider>
      );

      expect(await screen.findByText(fileToTest.filnavn)).toBeInTheDocument();

      const deleteButton = screen.getByRole("button", { description: fileToTest.filnavn });

      user.click(deleteButton);

      await waitForElementToBeRemoved(deleteButton);

      const deleteRequestBody = fetch.mock.calls[0][1]?.body as string;
      const requestJson = JSON.parse(deleteRequestBody);

      expect(fetch.mock.calls.length).toEqual(1);
      expect(fetch.mock.calls[0][1]?.method).toEqual("DELETE");

      expect(requestJson.filnavn).toBe(fileToTest.filnavn);
      expect(requestJson.filsti).toBe(fileToTest.filsti);
    });
  });
});
