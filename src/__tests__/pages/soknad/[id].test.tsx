import {screen, render, act} from "@testing-library/react";
import React from "react";
import Søknad from "../../../pages/soknad/[id]";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      query: { id: "12345" },
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
    };
  },
}));

describe("Søknad", () => {
  test("Viser siden", async () => {
    render(<Søknad />);
    expect(
      screen.getByRole("heading", {
        name: /Søknad/i,
      })
    ).toBeInTheDocument();
  });
});
