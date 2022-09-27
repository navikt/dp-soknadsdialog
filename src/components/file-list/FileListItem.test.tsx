import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SanityProvider } from "../../context/sanity-context";
import { sanityMocks } from "../../__mocks__/sanity.mocks";
import { mockDokumentkravList } from "../../localhost-data/dokumentkrav-list";
import fetch from "jest-fetch-mock";
import { FileListItem } from "./FileListItem";

describe("FileListItem", () => {
  beforeEach(() => {
    fetch.enableMocks();
  });

  afterEach(() => {
    fetch.mockReset();
  });

  test("Should show file name", async () => {
    render(
      <SanityProvider initialState={sanityMocks}>
        <FileListItem
          file={mockDokumentkravList.krav[0].filer[0]}
          dokumentkravId={mockDokumentkravList.krav[0].id}
          handleUploadedFiles={() => ""}
        />
      </SanityProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText(mockDokumentkravList.krav[0].filer[0].filnavn)).toBeInTheDocument();
    });
  });

  test("Should be able to delete a file", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        ok: true,
      })
    );

    render(
      <SanityProvider initialState={sanityMocks}>
        <FileListItem
          file={mockDokumentkravList.krav[0].filer[0]}
          dokumentkravId={mockDokumentkravList.krav[0].id}
          handleUploadedFiles={() => ""}
        />
      </SanityProvider>
    );

    const deleteButton = screen.getByRole("button");

    userEvent.click(deleteButton);

    await waitFor(() => {
      expect(fetch.mock.calls.length).toEqual(1);
    });
  });
});
