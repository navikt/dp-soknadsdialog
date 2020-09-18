import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Søknad from "../søknad";

test("Hent neste fakta", async () => {
  const { findByLabelText } = render(<Søknad />);

  expect(await findByLabelText("Ønsket dato")).toBeInTheDocument();
});

test("Kan svare på ønsket dato", async () => {
  const { findByLabelText } = render(<Søknad />);

  const input = await findByLabelText("Ønsket dato", { selector: "input" });
  expect(input).toBeInTheDocument();

  const ønsketDato = "2020-01-31";

  await userEvent.type(input, ønsketDato);
  expect(input).toHaveValue(ønsketDato);

  await waitFor(() => expect(input).toHaveClass("lagret"));
});
