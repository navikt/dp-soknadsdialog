import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dokumentkrav } from "../../../components/dokumentkrav/Dokumentkrav";
import { SanityProvider } from "../../../context/sanity-context";
import { DOKUMENTKRAV_SVAR_SEND_NAA } from "../../../constants";
import fetch from "jest-fetch-mock";
import { mockDokumentkravList } from "../../../localhost-data/dokumentkrav-list";

const mockSanity = {
  fakta: [],
  seksjoner: [],
  svaralternativer: [],
  landgrupper: [],
  apptekster: [],
  startside: [],
};

describe("Dokumentkrav", () => {
  test("Should show dokumentkrav info", async () => {
    render(
      <SanityProvider initialState={mockSanity}>
        <Dokumentkrav dokumentkrav={mockDokumentkravList.krav[0]} />
      </SanityProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText(mockDokumentkravList.krav[0].beskrivendeId)).toBeInTheDocument();
    });
  });

  test("Should show upload component when question has a specific answer", async () => {
    const user = userEvent.setup();

    render(
      <SanityProvider initialState={mockSanity}>
        <Dokumentkrav dokumentkrav={mockDokumentkravList.krav[0]} />
      </SanityProvider>
    );

    await user.click(screen.getByLabelText(DOKUMENTKRAV_SVAR_SEND_NAA));

    await waitFor(() => {
      expect(screen.queryByText("Dra filene hit eller")).toBeInTheDocument();
    });
  });

  test("Should show already uploaded files when showing upload component", async () => {
    const user = userEvent.setup();

    render(
      <SanityProvider initialState={mockSanity}>
        <Dokumentkrav dokumentkrav={mockDokumentkravList.krav[0]} />
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
      <SanityProvider initialState={mockSanity}>
        <Dokumentkrav dokumentkrav={mockDokumentkravList.krav[0]} />
      </SanityProvider>
    );

    await user.click(screen.getByLabelText("dokumentkrav.svar.sender.ikke"));

    await waitFor(() => {
      expect(screen.getByLabelText("dokumentkrav.sender.ikke.begrunnelse")).toBeInTheDocument();
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
        expect(screen.queryByText("Dra filene hit eller")).toBeInTheDocument();
      });
    }

    describe("When user selects a valid file to upload", () => {
      beforeEach(() => {
        fetch.mockResponse(
          JSON.stringify({
            ok: true,
            urn: "1234",
            filnavn: "image.png",
          })
        );
      });

      it("Should show the file after upload", async () => {
        const user = userEvent.setup();

        render(
          <SanityProvider initialState={mockSanity}>
            <Dokumentkrav dokumentkrav={mockDokumentkravList.krav[0]} />
          </SanityProvider>
        );

        const file = new File(["file"], "image.jpg", {
          type: "image/jpg",
        });

        await simulateNavigateToUpload(user, screen);

        simulateFileUpload(screen, [file]);

        expect(await screen.findByText(file.name)).toBeInTheDocument();

        const fileContainer = screen.getByText(file.name).closest("li");

        await waitFor(() => {
          expect(fileContainer?.innerHTML).toContain("Ferdig opplastet");
          expect(fetch.mock.calls.length).toEqual(1);
        });
      });
    });

    it("Should show info on invalid files, and not upload anything", async () => {
      const user = userEvent.setup();

      render(
        <SanityProvider initialState={mockSanity}>
          <Dokumentkrav dokumentkrav={mockDokumentkravList.krav[0]} />
        </SanityProvider>
      );

      const file = new File(["file"], "image.json", {
        type: "application/json",
      });

      await simulateNavigateToUpload(user, screen);

      simulateFileUpload(screen, [file]);

      expect(await screen.findByText(file.name)).toBeInTheDocument();

      const fileContainer = screen.getByText(file.name).closest("li");

      await waitFor(() => {
        expect(fileContainer?.innerHTML).toContain("Feil format - ikke lastet opp");
        expect(fetch.mock.calls.length).toEqual(0);
      });
    });
  });
});
