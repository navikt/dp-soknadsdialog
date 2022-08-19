import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { FaktumEnvalg } from "../../../components/faktum/FaktumEnvalg";
import { SanityProvider } from "../../../context/sanity-context";
import { IQuizGeneratorFaktum, IQuizSeksjon, QuizFaktum } from "../../../types/quiz.types";
import { QuizProvider } from "../../../context/quiz-context";
import { IQuizState } from "../../../localhost-data/quiz-state-response";

const mockSanity = {
  fakta: [],
  seksjoner: [],
  svaralternativer: [],
  landgrupper: [],
  apptekster: [],
  startside: [],
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

const sectionMockData: IQuizSeksjon = {
  fakta: [faktumMockData],
  beskrivendeId: "gjenopptak",
  ferdig: true,
};

const soknadStateMockData: IQuizState = {
  ferdig: false,
  seksjoner: [sectionMockData],
};

describe("Faktum", () => {
  test("Should show faktum question and answers", async () => {
    render(
      <SanityProvider initialState={mockSanity}>
        <QuizProvider initialState={soknadStateMockData}>
          <FaktumEnvalg faktum={faktumMockData} />
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

  test("Should show preselected faktum answer if it's already selected", async () => {
    const svar = faktumMockData.gyldigeValg[2];
    faktumMockData.svar = svar;

    render(
      <SanityProvider initialState={mockSanity}>
        <QuizProvider initialState={soknadStateMockData}>
          <FaktumEnvalg faktum={faktumMockData} />
        </QuizProvider>
      </SanityProvider>
    );

    // Casting it to access the value attribute
    const checkedRadio = screen.getByRole("radio", { checked: true }) as HTMLInputElement;

    await waitFor(() => {
      expect(checkedRadio.value).toBe(svar);
    });
  });
});
