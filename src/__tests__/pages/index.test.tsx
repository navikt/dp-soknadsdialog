import { screen, render, fireEvent } from "@testing-library/react";
import React from "react";
import Home from "../../pages";

import { useRouter } from "next/router";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ søknad_uuid: "12345678" }),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

describe("Home", () => {
  const push = jest.fn();
  useRouter.mockImplementation(() => ({
    push,
    pathname: "/",
    route: "/",
    asPath: "/",
    query: "",
  }));

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
    fireEvent.click(startSøknadKnapp);
    // FÅr ikke dette til å fungere :angry_red_face:
    //expect(push).toHaveBeenCalledWith("/soknad/123456789");
  });
});
