import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { Receipt } from "./Receipt";
import { IQuizSeksjon, ISoknadStatus, QuizFaktum } from "../../types/quiz.types";
import userEvent from "@testing-library/user-event";
import { MockContext, mockSanityTexts } from "../../__mocks__/MockContext";
import { IDokumentkrav } from "../../types/documentation.types";
import { IPersonalia } from "../../types/personalia.types";
import {
  ISanityFaktum,
  ISanitySeksjon,
  ISanitySvaralternativ,
  ISanityTexts,
} from "../../types/sanity.types";

vi.mock("../../hooks/useSession", () => {
  return {
    useSession: vi.fn(() => ({
      session: { expiresIn: 1234 },
      isLoading: false,
      isError: false,
    })),
  };
});

const dokumentkrav: IDokumentkrav = {
  id: "6679",
  beskrivendeId: "dokumentasjonskrav.krav.arbeidsforhold",
  beskrivelse: "Rema 1000",
  fakta: [],
  filer: [],
  gyldigeValg: [
    "dokumentkrav.svar.send.naa",
    "dokumentkrav.svar.send.senere",
    "dokumentkrav.svar.andre.sender",
    "dokumentkrav.svar.sendt.tidligere",
    "dokumentkrav.svar.sender.ikke",
  ],
  svar: "dokumentkrav.svar.send.senere",
  begrunnelse: "Jeg skal sende disse senere.",
};

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

const soknadStatus: ISoknadStatus = {
  status: "UnderBehandling",
  opprettet: "2022-10-21T09:42:37.291157",
  innsendt: "2022-10-21T09:47:29",
};

const personalia: IPersonalia = {
  forNavn: "Donald",
  mellomNavn: "Anton",
  etterNavn: "Duck",
  fødselsDato: "090634",
  ident: "36963",
};

describe("Receipt", () => {
  test("Should show summary question and answers", async () => {
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
        <Receipt
          arbeidssokerStatus="REGISTERED"
          soknadStatus={soknadStatus}
          sections={[sectionMockdata]}
          personalia={personalia}
        />
      </MockContext>,
    );

    const expandSummaryButton = screen.getByRole("button", {
      name: "kvittering.dine-svar.header",
    });

    user.click(expandSummaryButton);

    await waitFor(() => {
      // Await the accordion animating open
      screen.findByText(sanitySection.title);

      expect(screen.queryByText(sanityFaktum.text)).toBeInTheDocument();

      if (faktumMockData.svar) {
        expect(screen.queryByText(sanitySvaralternativ.text)).toBeInTheDocument();
      }
    });
  });

  describe("Arbeidssøkerstatus", () => {
    test("Should show warning if user has not signed up as registrert arbeidssøker", async () => {
      render(
        <MockContext>
          <Receipt
            arbeidssokerStatus="UNREGISTERED"
            soknadStatus={soknadStatus}
            sections={[]}
            personalia={personalia}
          />
        </MockContext>,
      );

      await waitFor(() => {
        expect(
          screen.queryByText("kvittering.arbeidssokerstatus.info-tekst.uregistrert"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Dokumentasjonskrav", () => {
    test("Should show dokumentkrav", async () => {
      render(
        <MockContext dokumentkrav={[dokumentkrav]}>
          <Receipt
            arbeidssokerStatus="REGISTERED"
            soknadStatus={soknadStatus}
            sections={[]}
            personalia={personalia}
          />
        </MockContext>,
      );

      expect(screen.queryByText(dokumentkrav.beskrivendeId, { exact: false })).toBeInTheDocument();
    });
  });
});
