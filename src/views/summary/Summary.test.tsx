import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { Summary } from "./Summary";
import { IQuizSeksjon, QuizFaktum } from "../../types/quiz.types";
import userEvent from "@testing-library/user-event";
import { mockSoknadState, MockContext, mockSanityTexts } from "../../__mocks__/MockContext";
import createFetchMock from "vitest-fetch-mock";

import { IPersonalia } from "../../types/personalia.types";
import {
  ISanityFaktum,
  ISanitySeksjon,
  ISanitySvaralternativ,
  ISanityTexts,
} from "../../types/sanity.types";

vi.mock("../../session.utils", () => {
  return {
    useSession: vi.fn(() => ({
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

const personalia: IPersonalia = {
  forNavn: "Donald",
  mellomNavn: "Anton",
  etterNavn: "Duck",
  fødselsDato: "090634",
  ident: "36963",
};

describe("Summary", () => {
  const fetch = createFetchMock(vi);

  beforeEach(() => {
    fetch.enableMocks();
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  // To fix ref scrollIntoView is not a function error
  // https://github.com/jsdom/jsdom/issues/1695#issuecomment-449931788
  Element.prototype.scrollIntoView = vi.fn();

  test("Should show questions and answers", async () => {
    const user = userEvent.setup();

    const sanitySection: ISanitySeksjon = {
      textId: sectionMockdata.beskrivendeId,
      title: "Tittel for en seksjon i sanity",
    };

    const sanityFaktum: ISanityFaktum = {
      textId: faktumMockData.beskrivendeId,
      text: "Spørsmålstekst for faktum",
    };

    const sanitySvaralternativ: ISanitySvaralternativ = {
      textId: faktumMockData.svar as string,
      text: "Ditt svar",
    };

    const sanityTexts: ISanityTexts = {
      ...mockSanityTexts,
      seksjoner: [sanitySection],
      fakta: [sanityFaktum],
      svaralternativer: [sanitySvaralternativ],
    };

    render(
      <MockContext quizSeksjoner={[sectionMockdata]} sanityTexts={sanityTexts}>
        <Summary personalia={personalia} />
      </MockContext>,
    );

    const expandSectionButton = screen.getByRole("button", {
      name: sanitySection.title,
    });

    user.click(expandSectionButton);

    await waitFor(() => {
      // Await the accordion animating open
      screen.findByText(sanityFaktum.text);

      expect(screen.queryByText(sanityFaktum.text)).toBeInTheDocument();
      faktumMockData.svar &&
        expect(screen.queryByText(sanitySvaralternativ.text)).toBeInTheDocument();
    });
  });

  test("Should show error message if user tries to send application without consenting", async () => {
    const user = userEvent.setup();

    render(
      <MockContext>
        <Summary personalia={personalia} />
      </MockContext>,
    );

    const sendApplicationButton = screen.getByRole("button", {
      name: "oppsummering.knapp.send-soknad",
    });

    user.click(sendApplicationButton);

    await waitFor(() => {
      expect(
        screen.queryByText("oppsummering.checkbox.samtykke-riktige-opplysninger.validering-tekst"),
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
        <Summary personalia={personalia} />
      </MockContext>,
    );

    const consentCheckbox = screen.getByRole("checkbox");

    const sendApplicationButton = screen.getByRole("button", {
      name: "oppsummering.knapp.send-soknad",
    });

    user.click(consentCheckbox);
    user.click(sendApplicationButton);

    await waitFor(() => {
      expect(
        screen.queryByText("oppsummering.feilmelding.soknad-ikke-ferdig-utfylt"),
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
        <Summary personalia={personalia} />
      </MockContext>,
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
