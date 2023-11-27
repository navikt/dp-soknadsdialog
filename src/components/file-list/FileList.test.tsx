import React from "react";
import { render, screen, fireEvent, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockDokumentkravList } from "../../localhost-data/dokumentkrav-list";
import createFetchMock from "vitest-fetch-mock";

import { MockContext } from "../../__mocks__/MockContext";
import { FileUploader } from "../file-uploader/FileUploader";
import { FileList } from "../../components/file-list/FileList";
import { useFileUploader } from "../../hooks/useFileUploader";

const FileTestContainer = () => {
  // Need to have a custom hook here to test the dynamic between FileUploader and FileList
  const { handleUploadedFiles, uploadedFiles } = useFileUploader(
    mockDokumentkravList.krav[0].filer
  );

  return (
    <>
      <FileUploader
        dokumentkrav={mockDokumentkravList.krav[0]}
        maxFileSize={100}
        handleUploadedFiles={handleUploadedFiles}
      />
      <FileList
        dokumentkravId={mockDokumentkravList.krav[0].id}
        uploadedFiles={uploadedFiles}
        handleUploadedFiles={handleUploadedFiles}
      />
    </>
  );
};

describe("FileList", () => {
  const fetch = createFetchMock(vi);

  beforeEach(() => {
    fetch.enableMocks();
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  describe("Upload file", () => {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    function simulateFileUpload(screen: any, array: File[]) {
      const inputEl = screen.getByTestId("dropzone");

      Object.defineProperty(inputEl, "files", {
        value: array,
      });

      fireEvent.drop(inputEl);
    }

    describe("When user selects a valid file to upload", () => {
      beforeEach(() => {
        fetch.mockResponse(
          JSON.stringify({
            ok: true,
            urn: "1234",
            filnavn: "image.jpg",
            filsti: "1234/5678",
          })
        );
      });

      it("Should show the file after upload", async () => {
        render(
          <MockContext>
            <FileTestContainer />
          </MockContext>
        );

        const file = new File(["file"], "image.jpg", {
          type: "image/jpg",
        });

        simulateFileUpload(screen, [file]);

        expect(await screen.findByText(file.name)).toBeInTheDocument();
        expect(fetch.mock.calls.length).toEqual(1);
      });
    });

    it("Should show info on invalid files, and not upload anything", async () => {
      render(
        <MockContext>
          <FileTestContainer />
        </MockContext>
      );

      const file = new File(["file"], "image.json", {
        type: "application/json",
      });

      simulateFileUpload(screen, [file]);

      expect(await screen.findByText(file.name)).toBeInTheDocument();
      expect(
        await screen.findByText("filopplaster.feilmelding.format-storrelse-beskrivelse")
      ).toBeInTheDocument();
      expect(fetch.mock.calls.length).toEqual(0);
    });
  });

  describe("Delete uploaded file", () => {
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
        <MockContext>
          <FileTestContainer />
        </MockContext>
      );

      const deleteButton = screen.getByRole("button", { description: fileToTest.filnavn });
      user.click(deleteButton);

      await waitForElementToBeRemoved(deleteButton);
      expect(fetch.mock.calls.length).toEqual(1);
    });
  });
});
