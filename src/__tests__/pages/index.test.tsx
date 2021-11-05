import { screen, render } from "@testing-library/react";
import React from "react";
import Home from "../../pages";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
    };
  },
}));

describe("Home", () => {
  test("Viser siden", async () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /Den spede begynnelse/i,
      })
    ).toBeInTheDocument();
  });
});
