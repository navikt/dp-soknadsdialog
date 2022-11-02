import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { FaktumDato } from "./FaktumDato";
import { SanityProvider } from "../../context/sanity-context";
import { IQuizGeneratorFaktum, IQuizSeksjon, IQuizState, QuizFaktum } from "../../types/quiz.types";
import { QuizProvider } from "../../context/quiz-context";
import fetch from "jest-fetch-mock";
import userEvent from "@testing-library/user-event";
import { sanityMocks } from "../../__mocks__/sanity.mocks";
import { ValidationProvider } from "../../context/validation-context";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  id: "8001",
  type: "localdate",
  readOnly: false,
  beskrivendeId: "faktum.dagpenger-soknadsdato",
  sannsynliggjoresAv: [],
};

const lagreFaktumMock = { status: "ok", sistBesvart: "123" };

const nesteMockData = {
  ferdig: false,
  seksjoner: [
    {
      fakta: [faktumMockData],
      beskrivendeId: "gjenopptak",
      ferdig: true,
    },
  ],
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

describe("FaktumDato", () => {
  // Undo any answer after each test
  beforeEach(() => (faktumMockData.svar = undefined));

  test("Should show faktum question and datepicker", async () => {
    render(
      <SanityProvider initialState={sanityMocks}>
        <QuizProvider initialState={soknadStateMockData}>
          <ValidationProvider>
            <FaktumDato faktum={faktumMockData} />
          </ValidationProvider>
        </QuizProvider>
      </SanityProvider>
    );

    const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId);

    await waitFor(() => {
      expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
      expect(datepicker).toBeInTheDocument();
    });
  });

  test("Should show preselected faktum answer if it's already selected", async () => {
    const svar = "2022-08-04";
    faktumMockData.svar = svar;

    render(
      <SanityProvider initialState={sanityMocks}>
        <QuizProvider initialState={soknadStateMockData}>
          <ValidationProvider>
            <FaktumDato faktum={faktumMockData} />
          </ValidationProvider>
        </QuizProvider>
      </SanityProvider>
    );

    // Casting it to access the value attribute
    const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;

    await waitFor(() => {
      expect(datepicker.value).toBe(svar);
    });
  });

  describe("When user selects an answer", () => {
    beforeEach(() => {
      fetch.enableMocks();
    });

    afterEach(() => {
      fetch.mockReset();
    });

    test("Should post the answer to the server", async () => {
      // First save the answer
      fetch.mockResponseOnce(JSON.stringify(lagreFaktumMock));
      // Then get next question (if any)
      fetch.mockResponseOnce(JSON.stringify(nesteMockData));

      const user = userEvent.setup();
      const svar = "2022-08-04";

      render(
        <SanityProvider initialState={sanityMocks}>
          <QuizProvider initialState={soknadStateMockData}>
            <ValidationProvider>
              <FaktumDato faktum={faktumMockData} />
            </ValidationProvider>
          </QuizProvider>
        </SanityProvider>
      );

      const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;

      // To trigger correct behavior as explained here: https://github.com/testing-library/user-event/issues/399#issuecomment-815664027
      await user.clear(datepicker);
      await user.type(datepicker, svar);

      await waitFor(() => {
        expect((datepicker as HTMLInputElement).value).toEqual(svar);

        expect(fetch.mock.calls.length).toEqual(1);

        // Does the first call save the faktum with the right answer?
        const putRequestBody = fetch.mock.calls[0][1]?.body as string;
        const requestJson = JSON.parse(putRequestBody);

        expect(requestJson.beskrivendeId).toBe(faktumMockData.beskrivendeId);
        expect(requestJson.svar).toBe(svar);
      });
    });
  });
});
