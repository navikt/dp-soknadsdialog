import "@testing-library/jest-dom/extend-expect"
import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render } from "@testing-library/react";
import Søknad from "../components/søknad";

const server = setupServer(
  rest.get("http://dp-quiz/neste-fakta", (req, res, ctx) => {
    return res(ctx.json([{ navn: "hello there" }]));
  })
);

beforeAll(() => server.listen());

test("Hent neste fakta", async () => {
  const { findByText } = render(<Søknad />);

  expect(await findByText(/finnDenne/i)).toBeInTheDocument()
});
