import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dokumentkrav, TRIGGER_FILE_UPLOAD } from "../../../components/dokumentkrav/Dokumentkrav";
import { SanityProvider } from "../../../context/sanity-context";

const mockdataDokumentkrav = {
  soknad_uuid: "12345",
  krav: [
    {
      id: "5678",
      beskrivendeId: "dokumentasjonskrav.krav.arbeidsforhold",
      fakta: [],
      filer: [
        {
          filnavn: "hei på du1.jpg",
          urn: "urn:dokumen1",
          tidspunkt: "1660571365067",
          storrelse: 1234556,
        },
        {
          filnavn: "hei på du2.jpg",
          urn: "urn:dokumen2",
          tidspunkt: "1660571365067",
          storrelse: 1234556,
        },
        {
          filnavn: "hei på du3.jpg",
          urn: "urn:dokumen3",
          tidspunkt: "1660571365067",
          storrelse: 1234556,
        },
      ],
      gyldigeValg: [
        "dokumentkrav.svar.send.inn.na",
        "dokumentkrav.svar.send.inn.senere",
        "dokumentkrav.svar.send.inn.noen_andre",
        "dokumentkrav.svar.sendt.inn.tidligere",
        "dokumentkrav.svar.send.inn.sender.ikke",
      ],
    },
  ],
};

const mockSanity = {
  fakta: [],
  seksjoner: [],
  svaralternativer: [],
  landgrupper: [],
  apptekster: [],
  startside: [],
};

test("Shows document item info", async () => {
  render(
    <SanityProvider initialState={mockSanity}>
      <Dokumentkrav dokumentkrav={mockdataDokumentkrav.krav[0]} />
    </SanityProvider>
  );

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

  await user.click(screen.getByLabelText(TRIGGER_FILE_UPLOAD));

  await waitFor(() => {
    expect(screen.queryByText("Dra filene hit eller")).toBeInTheDocument();
    expect(screen.queryByText(mockdataDokumentkrav.krav[0].filer[0].filnavn)).toBeInTheDocument();
    expect(screen.queryByText(mockdataDokumentkrav.krav[0].filer[1].filnavn)).toBeInTheDocument();
  });
});
