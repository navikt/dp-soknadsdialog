import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Søknad from "../søknad";

test("Hent neste fakta", async () => {
  const { findByLabelText } = render(
    <Søknad id="83f7c85f-c513-489a-846b-bd4271bb7f8e" />
  );

  expect(await findByLabelText(/Ønsker/)).toBeInTheDocument();
});

test("Kan gå til neste seksjon når alle spørsmål er besvart", async () => {
  const { findByTestId } = render(<Søknad id="kort-seksjon" />);

  const nesteKnapp = await findByTestId("neste-knapp");

  expect(nesteKnapp).toBeDisabled();

  const input = await findByTestId("input-0-123");

  userEvent.type(input, `10{enter}`);

  await waitFor(() => expect(nesteKnapp).toBeEnabled());
});

test("Kan gå til forrige seksjon", async () => {
  const { findByTestId } = render(<Søknad id="kort-seksjon" />);

  const input = await findByTestId("input-0-123", {
    selector: "input",
  });

  userEvent.type(input, `10{enter}`);

  await page.klikkNeste();

  await waitFor(() => expect(input).not.toBeInTheDocument());

  userEvent.click(await findByTestId("tilbake-knapp"));

  await waitFor(async () =>
    expect(await findByTestId("input-0-123")).toBeInTheDocument()
  );
});

test("Går til oppsummering når det ikke er flere seksjoner å besvare", async () => {
  const { findByTestId } = render(<Søknad id="tom-seksjon" />);

  expect(await findByTestId("oppsummering")).toBeInTheDocument();
});

const page = {
  klikkNeste: async () => {
    const nesteKnapp = await screen.findByTestId("neste-knapp");
    await waitFor(() => expect(nesteKnapp).toBeEnabled());
    userEvent.click(nesteKnapp);
  },
};
