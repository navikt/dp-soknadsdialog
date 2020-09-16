import { rest } from "msw";
import { setupServer } from "msw/node";
import { render } from "@testing-library/react";
import Søknad from "../søknad";

const server = setupServer(
  rest.get(
    `${process.env.NEXT_PUBLIC_API_URL}/neste-fakta`,
    (req, res, ctx) => {
      return res(
        ctx.json([
          {
            id: "1231",
            slug: "q1",
            navn: "hello there kenobi",
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
  const { findByText } = render(<Søknad />);

  expect(await findByText(/finnDenne/i)).toBeInTheDocument();
});
