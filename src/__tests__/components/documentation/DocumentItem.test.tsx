import React from "react";
import { render, waitFor, screen, waitForElementToBeRemoved } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { DocumentItem } from "../../../components/documentation/DocumentItem";
import fetchMock from "fetch-mock-jest";

const mockdataDocumentItem = {
  id: "5678",
  beskrivendeId: "arbeidsforhold.1",
  files: ["urn:dokumen1", "urn:dokumen2", "urn:dokumen3"],
};

const mockdataDocuments = [
  { filnavn: "fil1.jpg", urn: "urn:vedlegg:id/fil1" },
  { filnavn: "filnavn2.jpg", urn: "urn:vedlegg:id/fil2" },
];

beforeEach(() => {
  fetchMock.get("/api/documentation/localhost-uuid/5678", mockdataDocuments);
});
afterEach(() => {
  fetchMock.mockReset();
});

test("Shows document item info", async () => {
  render(<DocumentItem documentItem={mockdataDocumentItem} />);

  await waitForElementToBeRemoved(() => screen.queryByText("Laster"));

  await waitFor(() => {
    expect(screen.queryByText(mockdataDocumentItem.beskrivendeId)).toBeInTheDocument();
  });
});

test("Shows upload when question has a specific answer", async () => {
  const user = userEvent.setup();

  render(<DocumentItem documentItem={mockdataDocumentItem} />);

  await waitForElementToBeRemoved(() => screen.queryByText("Laster"));

  await user.click(screen.getByLabelText("Laste opp nå"));

  await waitFor(() => {
    expect(screen.queryByText("Dra filene hit eller")).toBeInTheDocument();
    expect(screen.queryByText(mockdataDocuments[0].filnavn)).toBeInTheDocument();
    expect(screen.queryByText(mockdataDocuments[1].filnavn)).toBeInTheDocument();
  });
});
