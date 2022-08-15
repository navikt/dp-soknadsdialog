import React from "react";
import { render, waitFor, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dokumentkrav, TRIGGER_FILE_UPLOAD } from "../../../components/dokumentkrav/Dokumentkrav";
import fetchMock from "fetch-mock-jest";
import { SanityProvider } from "../../../context/sanity-context";

const mockdataDokumentkrav = {
  soknad_uuid: "12345",
  krav: [
    {
      id: "5678",
      beskrivendeId: "dokumentasjonskrav.arbeidsforhold",
      filer: [
        {
          filnavn: "hei på du1.jpg",
          urn: "urn:dokumen1",
          timestamp: "1660571365067",
        },
        {
          filnavn: "hei på du2.jpg",
          urn: "urn:dokumen2",
          timestamp: "1660571365067",
        },
        {
          filnavn: "hei på du3.jpg",
          urn: "urn:dokumen3",
          timestamp: "1660571365067",
        },
      ],
      gyldigeValg: [
        "dokumentkrav.send.inn.na",
        "dokumentkrav.send.inn.senere",
        "dokumentkrav.send.inn.noen_andre",
        "dokumentkrav.sendt.inn.tidligere",
        "dokumentkrav.send.inn.sender.ikke",
      ],
    },
  ],
};

const mockdataDocuments = [
  { filnavn: "fil1.jpg", urn: "urn:vedlegg:id/fil1" },
  { filnavn: "filnavn2.jpg", urn: "urn:vedlegg:id/fil2" },
];

const mockSanity = {
  fakta: [],
  seksjoner: [],
  svaralternativer: [],
  landgrupper: [],
  apptekster: [],
  startside: [],
};

beforeEach(() => {
  fetchMock.get("/api/documentation/localhost-uuid/5678", mockdataDocuments);
});
afterEach(() => {
  fetchMock.mockReset();
});

test("Shows document item info", async () => {
  render(
    <SanityProvider initialState={mockSanity}>
      <Dokumentkrav dokumentkrav={mockdataDokumentkrav.krav[0]} />
    </SanityProvider>
  );

  await waitForElementToBeRemoved(() => screen.queryByText("Laster"));

  await waitFor(() => {
    expect(screen.queryByText(mockdataDokumentkrav.krav[0].beskrivendeId)).toBeInTheDocument();
  });
});

test("Shows upload when question has a specific answer", async () => {
  const user = userEvent.setup();

  render(
    <SanityProvider initialState={mockSanity}>
      <Dokumentkrav dokumentkrav={mockdataDokumentkrav.krav[0]} />
    </SanityProvider>
  );

  await waitForElementToBeRemoved(() => screen.queryByText("Laster"));

  await user.click(screen.getByLabelText(TRIGGER_FILE_UPLOAD));

  await waitFor(() => {
    expect(screen.queryByText("Dra filene hit eller")).toBeInTheDocument();
    expect(screen.queryByText(mockdataDocuments[0].filnavn)).toBeInTheDocument();
    expect(screen.queryByText(mockdataDocuments[1].filnavn)).toBeInTheDocument();
  });
});
