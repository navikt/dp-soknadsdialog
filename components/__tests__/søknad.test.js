import { findByLabelText, findByTestId, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Søknad from "../søknad";

test("Hent neste fakta", async () => {
  const { findByLabelText } = render(
    <Søknad id="83f7c85f-c513-489a-846b-bd4271bb7f8e" />
  );

  expect(await findByLabelText(/Ønsker/)).toBeInTheDocument();
});

test("Kan svare på ønsket dato", async () => {
  const { findByLabelText, findByTestId } = render(
    <Søknad id="83f7c85f-c513-489a-846b-bd4271bb7f8e" />
  );

  const input = await findByLabelText(/Ønsker dagpenger fra/, {
    selector: "input",
  });
  expect(input).toBeInTheDocument();

  const ønsketDato = "10.09.2020";

  await userEvent.type(input, `${ønsketDato}{enter}`);
  await expect(input).toHaveValue(ønsketDato);

  expect(await findByTestId("spørsmål-2")).toHaveClass("lagret");
});

test("Kan svare på antall uker", async () => {
  const { findByTestId } = render(
    <Søknad id="83f7c85f-c513-489a-846b-bd4271bb7f8e" />
  );

  const input = await findByTestId("input-3", {
    selector: "input",
  });
  expect(input).toBeInTheDocument();

  expect(input).toHaveAttribute("inputMode", "numeric");
});
