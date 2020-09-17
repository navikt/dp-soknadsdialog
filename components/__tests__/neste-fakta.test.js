import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Søknad from "../søknad";

const server = setupServer(
  rest.get(
    `${process.env.NEXT_PUBLIC_API_URL}/neste-fakta`,
    (req, res, ctx) => {
      return res(
        ctx.json([
          {
            id: "1231",
            navn: "Ønsket dato",
          },
        ])
      );
    }
  ),
  rest.put(
    `${process.env.NEXT_PUBLIC_API_URL}/faktum/:faktumId`,
    (req, res, ctx) => {
      const { faktumId } = req.params;
      const { svar } = req.body;
      return res(
        ctx.json([
          {
            id: faktumId,
            navn: "Ønsket dato",
            svar,
          },
        ])
      );
    }
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("Hent neste fakta", async () => {
  const { findByLabelText } = render(<Søknad />);

  expect(await findByLabelText("Ønsket dato")).toBeInTheDocument();
});

test("Kan svare på ønsket dato", async () => {
  const { findByLabelText } = render(<Søknad />);

  const input = await findByLabelText("Ønsket dato", { selector: "input" });
  expect(input).toBeInTheDocument();

  const ønsketDato = "2020-01-31";

  userEvent.type(input, ønsketDato);
  expect(input).toHaveValue(ønsketDato);

  await waitFor(() => expect(input).toHaveClass("lagret"));
});
