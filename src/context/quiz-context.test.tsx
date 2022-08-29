import React from "react";
import { QuizProvider, useQuiz } from "./quiz-context";
import { FaktumBoolean } from "../components/faktum/FaktumBoolean";
import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import { IQuizState } from "../localhost-data/quiz-state-response";
import { IQuizBooleanFaktum } from "../types/quiz.types";
import { SanityProvider } from "./sanity-context";
import { ISanityTexts } from "../types/sanity.types";
import { setupServer } from "msw/node";
import { rest } from "msw";
import userEvent from "@testing-library/user-event";

const initialState: IQuizState = { ferdig: false, seksjoner: [] };
const faktum: IQuizBooleanFaktum = {
  beskrivendeId: "f1",
  gyldigeValg: ["f1.svar.ja", "f1.svar.nei"],
  id: "1",
  readOnly: false,
  type: "boolean",
};
const sanityText: ISanityTexts = {
  apptekster: [],
  dokumentkrav: [],
  dokumentkravSvar: [],
  fakta: [],
  infosider: [],
  landgrupper: [],
  seksjoner: [],
  svaralternativer: [],
};

const server = setupServer(
  rest.put("/api/soknad/localhost-uuid/faktum/1", (req, res, ctx) =>
    res(
      ctx.json({
        status: "ok",
        sistBesvart: "123",
      })
    )
  ),
  rest.get("/api/soknad/localhost-uuid/neste", (req, res, ctx) => {
    const sistLagret = req.url.searchParams.get("sistLagret");
    if (sistLagret == "123") {
      return res(ctx.status(200), ctx.json({ ...faktum, svar: true }));
    } else {
      return res(ctx.status(500));
    }
  })
);
beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());

function ContextSpion() {
  const { isLoading, isError } = useQuiz();
  if (isLoading) return <>Laster</>;
  if (isError) return <>Error</>;
  return null;
}

test("Vi henter sistLagret hver gang vi lagrer et faktum", async () => {
  render(
    <SanityProvider initialState={sanityText}>
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
