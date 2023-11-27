import React from "react";
import { QuizProvider, useQuiz } from "./quiz-context";
import { FaktumBoolean } from "../components/faktum/faktum-boolean/FaktumBoolean";
import { render, screen, waitFor } from "@testing-library/react";
import { IQuizBooleanFaktum, IQuizState } from "../types/quiz.types";
import { SanityProvider } from "./sanity-context";
import createFetchMock from "vitest-fetch-mock";

import userEvent from "@testing-library/user-event";
import { mockSanityTexts } from "../__mocks__/MockContext";
import { ValidationProvider } from "./validation-context";

const initialState: IQuizState = { ferdig: false, seksjoner: [], antallSeksjoner: 0 };
const faktum: IQuizBooleanFaktum = {
  beskrivendeId: "f1",
  gyldigeValg: ["f1.svar.ja", "f1.svar.nei"],
  id: "1",
  readOnly: false,
  type: "boolean",
  sannsynliggjoresAv: [],
};

// We need to await states in these tests, and the way to do that is to await
// screen changes. Explicitly print out the loading and error states so that we can await and test for those
function ContextSpion() {
  const { isLoading, isError } = useQuiz();
  if (isLoading) return <>Laster</>;
  if (isError) return <>Error</>;
  return null;
}

describe("Quiz context", () => {
  const fetch = createFetchMock(vi);

  beforeEach(() => {
    fetch.enableMocks();
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  test("Should save a faktum when a user selects an answer", async () => {
    fetch.mockResponseOnce(JSON.stringify({ ...faktum, svar: true }));

    render(
      <SanityProvider initialState={mockSanityTexts}>
        <QuizProvider initialState={initialState}>
          <ValidationProvider>
            <FaktumBoolean faktum={faktum} />
            <ContextSpion />
          </ValidationProvider>
        </QuizProvider>
      </SanityProvider>,
    );

    const user = userEvent.setup();
    const radio = screen.getByLabelText("f1.svar.ja");
    await user.click(radio);

    waitFor(() => {
      expect(fetch.mock.calls.length).toEqual(1);

      // Does the first call save the faktum with the right answer?
      const putRequestBody = fetch.mock.calls[0][1]?.body as string;
      const requestJson = JSON.parse(putRequestBody);

      expect(requestJson.beskrivendeId).toBe(faktum.beskrivendeId);
      expect(requestJson.svar).toBe(true);
    });
  });

  test("Should register error if the faktum could not be saved", async () => {
    fetch.mockReject(new Error("fake error message"));
    vi.spyOn(console, "error").mockImplementation(() => {
      // Suppressing the error warning from quiz-context to make the test logs prettier
    });

    render(
      <SanityProvider initialState={mockSanityTexts}>
        <QuizProvider initialState={initialState}>
          <ValidationProvider>
            <FaktumBoolean faktum={faktum} />
            <ContextSpion />
          </ValidationProvider>
        </QuizProvider>
      </SanityProvider>,
    );

    const user = userEvent.setup();
    const radio = screen.getByLabelText("f1.svar.ja");
    await user.click(radio);

    waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
      expect(fetch.mock.calls.length).toEqual(1);
    });
  });
});
