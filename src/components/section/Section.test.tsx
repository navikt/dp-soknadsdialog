import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { Section } from "./Section";
import { IQuizSeksjon } from "../../types/quiz.types";
import { MockContext } from "../../__mocks__/MockContext";

const sectionMockData: IQuizSeksjon = {
  fakta: [
    {
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
    },
  ],
  beskrivendeId: "din-situasjon",
  ferdig: true,
};

describe("Section", () => {
  test("Should show section info and the first unanswered question", async () => {
    render(
      <MockContext quizSeksjoner={[sectionMockData]}>
        <Section section={sectionMockData} />
      </MockContext>,
    );

    await waitFor(() => {
      expect(screen.queryByText(sectionMockData.beskrivendeId)).toBeInTheDocument();
      expect(screen.queryByText(sectionMockData.fakta[0].beskrivendeId)).toBeInTheDocument();
    });
  });
});
