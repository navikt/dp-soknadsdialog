import { findByTestId, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Søknad from "../søknad";

test("Hent neste fakta", async () => {
  const { findByLabelText } = render(<Søknad />);

  expect(await findByLabelText("Ønsket dato")).toBeInTheDocument();
});

test("Kan svare på ønsket dato", async () => {
  const { findByLabelText, findByTestId } = render(<Søknad />);

  const input = await findByLabelText("Ønsket dato", { selector: "input" });
  expect(input).toBeInTheDocument();

  const ønsketDato = "10.09.2020";

  await userEvent.type(input, `${ønsketDato}{enter}`);
  await expect(input).toHaveValue(ønsketDato);

  expect(await findByTestId("spørsmål-Ønsket dato")).toHaveClass("lagret");
});

test("Kan svare på antall uker", async () => {
  const { findByLabelText } = render(<Søknad />);

  const input = await findByLabelText("Ønsket antall uker", {
    selector: "input",
  });
  expect(input).toBeInTheDocument();

  expect(input).toHaveAttribute("inputMode", "numeric");
});
