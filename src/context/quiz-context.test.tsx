import React from "react";
import { QuizProvider, useQuiz } from "./quiz-context";
import { FaktumBoolean } from "../components/faktum/FaktumBoolean";
import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import { IQuizState } from "../localhost-data/quiz-state-response";
import { IQuizBooleanFaktum } from "../types/quiz.types";
import { SanityProvider } from "./sanity-context";
import fetch from "jest-fetch-mock";

import userEvent from "@testing-library/user-event";
import { sanityMocks } from "../__mocks__/sanity.mocks";

const initialState: IQuizState = { ferdig: false, seksjoner: [] };
const faktum: IQuizBooleanFaktum = {
  beskrivendeId: "f1",
  gyldigeValg: ["f1.svar.ja", "f1.svar.nei"],
  id: "1",
  readOnly: false,
  type: "boolean",
  sannsynliggjøresAv: [],
};

beforeEach(() => {
  fetch.enableMocks();
});

afterEach(() => {
  fetch.mockReset();
});

function ContextSpion() {
  const { isLoading, isError } = useQuiz();
  if (isLoading) return <>Laster</>;
  if (isError) return <>Error</>;
  return null;
}

test("Vi henter sistLagret hver gang vi lagrer et faktum", async () => {
  fetch.mockResponseOnce(
    JSON.stringify({
      status: "ok",
      sistBesvart: "123",
    })
  );
  fetch.mockResponseOnce(JSON.stringify({ ...faktum, svar: true }));

  render(
    <SanityProvider initialState={sanityMocks}>
      <QuizProvider initialState={initialState}>
        <FaktumBoolean faktum={faktum} />
        <ContextSpion></ContextSpion>
      </QuizProvider>
    </SanityProvider>
  );

  const user = userEvent.setup();
  const radio = screen.getByLabelText("f1.svar.ja");
  await user.click(radio);

  expect(screen.getByText("Laster")).toBeInTheDocument();
  await waitForElementToBeRemoved(() => screen.getByText("Laster"));
  expect(screen.queryByText("Error")).not.toBeInTheDocument();
});
