import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { Section } from "./Section";
import { SanityProvider } from "../../context/sanity-context";
import { IQuizSeksjon, IQuizState } from "../../types/quiz.types";
import { QuizProvider } from "../../context/quiz-context";
import { sanityMocks } from "../../__mocks__/sanity.mocks";
import { ValidationProvider } from "../../context/validation-context";

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
      sannsynliggjoresAv: [],
    },
  ],
  beskrivendeId: "din-situasjon",
  ferdig: true,
};

const mockSoknadState: IQuizState = {
  ferdig: false,
  antallSeksjoner: 11,
  seksjoner: [sectionMockData],
};

describe("Section", () => {
  test("Should show section info and the first unanswered question", async () => {
    render(
      <SanityProvider initialState={sanityMocks}>
        <QuizProvider initialState={mockSoknadState}>
          <ValidationProvider>
            <Section section={sectionMockData} firstUnansweredFaktumIndex={0} />
          </ValidationProvider>
        </QuizProvider>
      </SanityProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText(sectionMockData.beskrivendeId)).toBeInTheDocument();
      expect(screen.queryByText(sectionMockData.fakta[0].beskrivendeId)).toBeInTheDocument();
    });
  });
});
