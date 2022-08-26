import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { Section } from "../../../components/section/Section";
import { SanityProvider } from "../../../context/sanity-context";
import { IQuizSeksjon } from "../../../types/quiz.types";
import { QuizProvider } from "../../../context/quiz-context";
import { IQuizState } from "../../../localhost-data/quiz-state-response";

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

const sectionMockData: IQuizSeksjon = {
  fakta: [
    {
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
    },
  ],
  beskrivendeId: "gjenopptak",
  ferdig: true,
};

const mockSoknadState: IQuizState = {
  ferdig: false,
  seksjoner: [sectionMockData],
};

describe("Section", () => {
  test("Should show section info and the first unanswered question", async () => {
    render(
      <SanityProvider initialState={mockSanity}>
        <QuizProvider initialState={mockSoknadState}>
          <Section section={sectionMockData} firstUnansweredFaktumIndex={0} />
        </QuizProvider>
      </SanityProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText(sectionMockData.beskrivendeId)).toBeInTheDocument();
      expect(screen.queryByText(sectionMockData.fakta[0].beskrivendeId)).toBeInTheDocument();
    });
  });
});
