import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { Faktum } from "./Faktum";
import { SanityProvider } from "../../context/sanity-context";
import { IQuizGeneratorFaktum, IQuizSeksjon, QuizFaktum } from "../../types/quiz.types";
import { QuizProvider } from "../../context/quiz-context";
import { IQuizState } from "../../localhost-data/quiz-state-response";

const mockSanity = {
  fakta: [],
  seksjoner: [],
  svaralternativer: [],
  landgrupper: [],
  apptekster: [],
  startside: [],
  dokumentkrav: [],
  dokumentkravSvar: [],
  infosider: [],
};

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  id: "10001",
  svar: "faktum.mottatt-dagpenger-siste-12-mnd.svar.nei",
  type: "envalg",
  readOnly: false,
  gyldigeValg: [
    "faktum.mottatt-dagpenger-siste-12-mnd.svar.ja",
    "faktum.mottatt-dagpenger-siste-12-mnd.svar.nei",
    "faktum.mottatt-dagpenger-siste-12-mnd.svar.vet-ikke",
  ],
  beskrivendeId: "faktum.mottatt-dagpenger-siste-12-mnd",
};

const sectionStateMockData: IQuizSeksjon = {
  fakta: [faktumMockData],
  beskrivendeId: "gjenopptak",
  ferdig: true,
};

const mockSoknadState: IQuizState = {
  ferdig: false,
  seksjoner: [sectionStateMockData],
};

describe("Faktum", () => {
  test("Should show faktum question and answers", async () => {
    render(
      <SanityProvider initialState={mockSanity}>
        <QuizProvider initialState={mockSoknadState}>
          <Faktum faktum={faktumMockData} />
        </QuizProvider>
      </SanityProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
      expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
      expect(screen.queryByText(faktumMockData.gyldigeValg[0])).toBeInTheDocument();
      expect(screen.queryByText(faktumMockData.gyldigeValg[1])).toBeInTheDocument();
      expect(screen.queryByText(faktumMockData.gyldigeValg[2])).toBeInTheDocument();
    });
  });
});
