import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { StartSoknad } from "./StartSoknad";
import userEvent from "@testing-library/user-event";
import { mockSoknadState, MockContext } from "../../__mocks__/MockContext";
import createFetchMock from "vitest-fetch-mock";

vi.mock("../../session.utils", () => {
  return {
    useSession: vi.fn(() => ({
      session: { expiresIn: 1234 },
      isLoading: false,
      isError: false,
    })),
  };
});

describe("StartSoknad", () => {
  const fetch = createFetchMock(vi);

  beforeEach(() => {
    fetch.enableMocks();
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  test("Should show error message if user tries to start application without consenting", async () => {
    const user = userEvent.setup();

    render(
      <MockContext>
        <StartSoknad />
      </MockContext>,
    );

    const startApplicationButton = screen.getByRole("button", {
      name: "start-soknad.knapp.start",
    });

    user.click(startApplicationButton);

    await waitFor(() => {
      expect(
        screen.queryByText("start-soknad.checkbox.samtykke-innhenting-data.validering-tekst"),
      ).toBeInTheDocument();

      expect(fetch.mock.calls.length).toBe(0);
    });
  });

  test("Should start an application", async () => {
    fetch.mockResponseOnce("localhost-uuid", { status: 200, statusText: "OK" });
    const user = userEvent.setup();

    const quizState = { ...mockSoknadState };
    quizState.ferdig = true;

    render(
      <MockContext soknadState={quizState}>
        <StartSoknad />
      </MockContext>,
    );

    const consentCheckbox = screen.getByRole("checkbox");

    const sendApplicationButton = screen.getByRole("button", {
      name: "start-soknad.knapp.start",
    });

    user.click(consentCheckbox);
    user.click(sendApplicationButton);

    await waitFor(() => {
      expect(fetch.mock.calls.length).toBe(1);
    });
  });
});
