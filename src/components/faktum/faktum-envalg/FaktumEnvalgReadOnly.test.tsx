import React from "react";
import { render, screen } from "@testing-library/react";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../../types/quiz.types";
import { MockContext, mockSanityTexts } from "../../../__mocks__/MockContext";
import { FaktumEnvalgReadOnly } from "./FaktumEnvalgReadOnly";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  id: "10001",
  type: "envalg",
  readOnly: false,
  gyldigeValg: [
    "faktum.mottatt-dagpenger-siste-12-mnd.svar.ja",
    "faktum.mottatt-dagpenger-siste-12-mnd.svar.nei",
    "faktum.mottatt-dagpenger-siste-12-mnd.svar.vet-ikke",
  ],
  beskrivendeId: "faktum.mottatt-dagpenger-siste-12-mnd",
  sannsynliggjoresAv: [],
};

describe("FaktumEnvalgReadOnly", () => {
  test("Should show faktum question and answers", async () => {
    const svar = faktumMockData.gyldigeValg[0];
    const mockedSvaralternativText = {
      textId: "faktum.mottatt-dagpenger-siste-12-mnd.svar.ja",
      text: "Ja",
    };

    render(
      <MockContext
        sanityTexts={{ ...mockSanityTexts, svaralternativer: [mockedSvaralternativText] }}
      >
        <FaktumEnvalgReadOnly faktum={{ ...faktumMockData, svar }} />
      </MockContext>,
    );

    expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
    expect(screen.queryByText(mockedSvaralternativText.text)).toBeInTheDocument();
  });
});
