import { screen, render } from "@testing-library/react";
import React from "react";
import Home from "../../pages";

describe("Home", () => {
  test("Viser siden", async () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /Viktig informasjon/i,
      })
    ).toBeInTheDocument();
  });
  test("Har en start søknad knapp", async () => {
    render(<Home />);

    const startSøknadKnapp = screen.getByRole("button", {
      name: /Start søknad/i,
    });
    expect(startSøknadKnapp).toBeInTheDocument();
  });
});
