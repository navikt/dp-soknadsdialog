import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Utfylling from "../utfylling";

xtest("Kan svare på ønsket dato", async () => {
  const { findByLabelText } = render(
    <Utfylling id="83f7c85f-c513-489a-846b-bd4271bb7f8e" />
  );

  const input = await findByLabelText(/Ønsker dagpenger fra/, {
    selector: "input",
  });
  expect(input).toBeInTheDocument();

  const ønsketDato = "10.09.2020";

  await userEvent.type(input, `${ønsketDato}{enter}`);
  await expect(input).toHaveValue(ønsketDato);
});

xtest("Kan svare på antall uker", async () => {
  const { findByTestId } = render(<Utfylling id="kort-seksjon" />);

  const input = await findByTestId("input-1", {
    selector: "input",
  });
  expect(input).toBeInTheDocument();

  expect(input).toHaveAttribute("inputMode", "numeric");

  const ønsketUker = "10";

  await userEvent.type(input, `${ønsketUker}{enter}`);
  await expect(input).toHaveValue(ønsketUker);
  const spørsmål = await findByTestId("spørsmål-1");
  await waitFor(() => expect(spørsmål).toHaveClass("lagret"));
});
