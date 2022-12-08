import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { Summary } from "./Summary";
import { IQuizSeksjon, QuizFaktum } from "../../types/quiz.types";
import userEvent from "@testing-library/user-event";
import { mockSoknadState, MockContext } from "../../__mocks__/MockContext";
import fetch from "jest-fetch-mock";

jest.mock("../../session.utils", () => {
  return {
    useSession: jest.fn(() => ({
      session: { expiresIn: 1234 },
      isLoading: false,
      isError: false,
    })),
  };
});

const faktumMockData: QuizFaktum = {
  id: "10001",
  svar: "faktum.mottatt-dagpenger-siste-12-mnd.svar.nei",
  type: "envalg",
  readOnly: false,
  gyldigeValg: [
    "faktum.mottatt-dagpenger-siste-12-mnd.svar.ja",
    "faktum.mottatt-dagpenger-siste-12-mnd.svar.nei",
    "faktum.mottatt-dagpenger-siste-12-mnd.svar.vet-ikke",
  ],
  beskrivendeId: "faktum.mottatt-dagpenger-siste-12-mnd",
  sannsynliggjoresAv: [],
  roller: [],
};

const sectionMockdata: IQuizSeksjon = {
  fakta: [faktumMockData],
  beskrivendeId: "din-situasjon",
  ferdig: true,
};

describe("Summary", () => {
  beforeEach(() => {
    fetch.enableMocks();
  });

  afterEach(() => {
    fetch.mockReset();
  });

  test("Should show questions and answers", async () => {
    const user = userEvent.setup();

    render(
      <MockContext quizSeksjoner={[sectionMockdata]}>
        <Summary />
      </MockContext>
    );

    const expandSectionButton = screen.getByRole("button", {
      name: sectionMockdata.beskrivendeId,
    });

    user.click(expandSectionButton);

    await waitFor(() => {
      // Await the accordion animating open
      screen.findByText(faktumMockData.beskrivendeId);

      expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
      faktumMockData.svar && expect(screen.queryByText(faktumMockData.svar)).toBeInTheDocument();
    });
  });

  test("Should show error message if user tries to send application without consenting", async () => {
    const user = userEvent.setup();

    render(
      <MockContext>
        <Summary />
      </MockContext>
    );

    const sendApplicationButton = screen.getByRole("button", {
      name: "oppsummering.knapp.send-soknad",
    });

    user.click(sendApplicationButton);

    await waitFor(() => {
      expect(
        screen.queryByText("oppsummering.checkbox.samtykke-riktige-opplysninger.validering-tekst")
      ).toBeInTheDocument();

      expect(fetch.mock.calls.length).toBe(0);
    });
  });

  test("Should show error message if user tries to send a partially done application", async () => {
    const user = userEvent.setup();

    const quizState = { ...mockSoknadState };
    quizState.ferdig = false;

    render(
      <MockContext soknadState={quizState}>
        <Summary />
      </MockContext>
    );

    const consentCheckbox = screen.getByRole("checkbox");

    const sendApplicationButton = screen.getByRole("button", {
      name: "oppsummering.knapp.send-soknad",
    });

    user.click(consentCheckbox);
    user.click(sendApplicationButton);

    await waitFor(() => {
      expect(
        screen.queryByText("oppsummering.feilmelding.soknad-ikke-ferdig-utfylt")
      ).toBeInTheDocument();

      expect(fetch.mock.calls.length).toBe(0);
    });
  });

  test("Should send the finished application", async () => {
    fetch.mockResponseOnce("OK", { status: 200, statusText: "OK" });
    const user = userEvent.setup();

    const quizState = { ...mockSoknadState };
    quizState.ferdig = true;

    render(
      <MockContext soknadState={quizState}>
        <Summary />
      </MockContext>
    );

    const consentCheckbox = screen.getByRole("checkbox");

    const sendApplicationButton = screen.getByRole("button", {
      name: "oppsummering.knapp.send-soknad",
    });

    user.click(consentCheckbox);
    user.click(sendApplicationButton);

    await waitFor(() => {
      expect(fetch.mock.calls.length).toBe(1);
    });
  });
});
