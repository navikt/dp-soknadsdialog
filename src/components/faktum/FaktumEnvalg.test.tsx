import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { FaktumEnvalg } from "./FaktumEnvalg";
import { SanityProvider } from "../../context/sanity-context";
import { IQuizGeneratorFaktum, IQuizSeksjon, IQuizState, QuizFaktum } from "../../types/quiz.types";
import { QuizProvider } from "../../context/quiz-context";
import userEvent from "@testing-library/user-event";
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
};

const sectionMockData: IQuizSeksjon = {
  fakta: [faktumMockData],
  beskrivendeId: "din-situasjon",
  ferdig: true,
};

const soknadStateMockData: IQuizState = {
  ferdig: false,
  antallSeksjoner: 11,
  seksjoner: [sectionMockData],
};

describe("FaktumEnvalg", () => {
  // Undo any answer after each test
  beforeEach(() => (faktumMockData.svar = undefined));

  test("Should show faktum question and answers", async () => {
    render(
      <SanityProvider initialState={sanityMocks}>
        <QuizProvider initialState={soknadStateMockData}>
          <ValidationProvider>
            <FaktumEnvalg faktum={faktumMockData} />
          </ValidationProvider>
        </QuizProvider>
      </SanityProvider>
    );

    await waitFor(() => {
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
      <SanityProvider initialState={sanityMocks}>
        <QuizProvider initialState={soknadStateMockData}>
          <ValidationProvider>
            <FaktumEnvalg faktum={faktumMockData} />
          </ValidationProvider>
        </QuizProvider>
      </SanityProvider>
    );

    // Casting it to access the value attribute
    const checkedRadio = screen.getByRole("radio", { checked: true }) as HTMLInputElement;

    await waitFor(() => {
      expect(checkedRadio.value).toBe(svar);
    });
  });

  describe("When user selects an answer", () => {
    test("Should post the answer to the server", async () => {
      const user = userEvent.setup();
      const svar = faktumMockData.gyldigeValg[0];
      const onchange = jest.fn();

      render(
        <SanityProvider initialState={sanityMocks}>
          <QuizProvider initialState={soknadStateMockData}>
            <ValidationProvider>
              <FaktumEnvalg faktum={faktumMockData} onChange={onchange} />
            </ValidationProvider>
          </QuizProvider>
        </SanityProvider>
      );

      const firstRadio = screen.getByLabelText(svar);

      user.click(firstRadio);

      await waitFor(() => {
        expect(onchange).toHaveBeenCalledTimes(1);
        expect(onchange).toBeCalledWith(faktumMockData, svar);
      });
    });
  });
});
