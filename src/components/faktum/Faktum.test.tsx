import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { Faktum } from "./Faktum";
import { SanityProvider } from "../../context/sanity-context";
import { IQuizGeneratorFaktum, IQuizSeksjon, QuizFaktum } from "../../types/quiz.types";
import { QuizProvider } from "../../context/quiz-context";
import { IQuizState } from "../../localhost-data/quiz-state-response";
import { sanityMocks } from "../../__mocks__/sanity.mocks";
import { ValidationProvider } from "../../context/validation-context";

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
  sannsynliggjoresAv: [],
  roller: [],
};

const dokumentasjonskravMockdata: QuizFaktum[] | IQuizGeneratorFaktum[] = [
  {
    id: "6005",
    type: "boolean",
    readOnly: false,
    gyldigeValg: [
      "faktum.reist-tilbake-en-gang-eller-mer.svar.ja",
      "faktum.reist-tilbake-en-gang-eller-mer.svar.nei",
    ],
    beskrivendeId: "faktum.reist-tilbake-en-gang-eller-mer",
    sannsynliggjoresAv: [],
    roller: [],
  },
];

const sectionStateMockData: IQuizSeksjon = {
  fakta: [faktumMockData],
  beskrivendeId: "gjenopptak",
  ferdig: true,
};

const mockSoknadState: IQuizState = {
  ferdig: false,
  seksjoner: [sectionStateMockData],
  roller: [],
};

describe("Faktum", () => {
  test("Should show faktum question and answers", async () => {
    render(
      <SanityProvider initialState={sanityMocks}>
        <QuizProvider initialState={mockSoknadState}>
          <ValidationProvider>
            <Faktum faktum={faktumMockData} />
          </ValidationProvider>
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

  test("Should show faktum dokumentation info if that's triggered by the answer", async () => {
    render(
      <SanityProvider initialState={sanityMocks}>
        <QuizProvider initialState={mockSoknadState}>
          <ValidationProvider>
            <Faktum
              faktum={{ ...faktumMockData, sannsynliggjoresAv: dokumentasjonskravMockdata }}
            />
          </ValidationProvider>
        </QuizProvider>
      </SanityProvider>
    );

    const dokumentationTitle = dokumentasjonskravMockdata[0].beskrivendeId;

    await waitFor(() => {
      expect(screen.queryByText(dokumentationTitle, { exact: false })).toBeInTheDocument();
    });
  });
});
