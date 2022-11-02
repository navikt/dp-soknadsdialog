import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { FaktumNumber } from "./FaktumNumber";
import { SanityProvider } from "../../context/sanity-context";
import { IQuizGeneratorFaktum, IQuizSeksjon, IQuizState, QuizFaktum } from "../../types/quiz.types";
import { QuizProvider } from "../../context/quiz-context";
import fetch from "jest-fetch-mock";
import userEvent from "@testing-library/user-event";
import { sanityMocks } from "../../__mocks__/sanity.mocks";
import { ValidationProvider } from "../../context/validation-context";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  beskrivendeId: "faktum.barn-inntekt",
  id: "1016",
  type: "int",
  readOnly: false,
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

describe("FaktumNumber", () => {
  // Undo any answer after each test
  beforeEach(() => (faktumMockData.svar = undefined));

  test("Should show faktum question and answers", async () => {
    render(
      <SanityProvider initialState={sanityMocks}>
        <QuizProvider initialState={soknadStateMockData}>
          <ValidationProvider>
            <FaktumNumber faktum={faktumMockData} />
          </ValidationProvider>
        </QuizProvider>
      </SanityProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
    });
  });

  test("Should show preselected faktum answer if it's already selected", async () => {
    const svar = 12;
    faktumMockData.svar = svar;

    render(
      <SanityProvider initialState={sanityMocks}>
        <QuizProvider initialState={soknadStateMockData}>
          <ValidationProvider>
            <FaktumNumber faktum={faktumMockData} />
          </ValidationProvider>
        </QuizProvider>
      </SanityProvider>
    );

    // Casting it to access the value attribute
    const textInput = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;

    await waitFor(() => {
      expect(parseInt(textInput.value)).toBe(svar); // textInput.value outputs string by default
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
      const svar = 14;

      render(
        <SanityProvider initialState={sanityMocks}>
          <QuizProvider initialState={soknadStateMockData}>
            <ValidationProvider>
              <FaktumNumber faktum={faktumMockData} />
            </ValidationProvider>
          </QuizProvider>
        </SanityProvider>
      );

      const textInput = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;

      // To trigger correct behavior as explained here: https://github.com/testing-library/user-event/issues/399#issuecomment-815664027
      await user.clear(textInput);
      await user.type(textInput, svar + "");

      await waitFor(() => {
        expect(parseInt(textInput.value)).toEqual(svar); // textInput.value outputs string by default
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
