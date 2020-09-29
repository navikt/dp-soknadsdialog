import { render, screen } from "@testing-library/react";
import Subsumsjoner from "../subsumsjoner";

xtest("Hent subsumsjoner", async () => {
  const { findAllByTestId } = render(
    <Subsumsjoner søknadId="83f7c85f-c513-489a-846b-bd4271bb7f8e" />
  );

  expect(await findAllByTestId(/subsumsjon/)).toHaveLength(12);
});

xtest("List ut fakta i subsumsjon", async () => {
  const { findAllByTestId } = render(
    <Subsumsjoner søknadId="83f7c85f-c513-489a-846b-bd4271bb7f8e" />
  );

  expect(await findAllByTestId(/faktum/)).toHaveLength(12);
});
