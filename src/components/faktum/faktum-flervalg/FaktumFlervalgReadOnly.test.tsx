import React from "react";
import { render, screen } from "@testing-library/react";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../../types/quiz.types";
import { MockContext, mockSanityTexts } from "../../../__mocks__/MockContext";
import { FaktumFlervalgReadOnly } from "./FaktumFlervalgReadOnly";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  id: "3008",
  type: "flervalg",
  readOnly: false,
  gyldigeValg: [
    "faktum.eget-gaardsbruk-type-gaardsbruk.svar.dyr",
    "faktum.eget-gaardsbruk-type-gaardsbruk.svar.jord",
    "faktum.eget-gaardsbruk-type-gaardsbruk.svar.skog",
    "faktum.eget-gaardsbruk-type-gaardsbruk.svar.annet",
  ],
  beskrivendeId: "faktum.eget-gaardsbruk-type-gaardsbruk",
  sannsynliggjoresAv: [],
};

describe("FaktumFlervalgReadOnly", () => {
  test("Should show faktum question and answers", async () => {
    const svar = [
      "faktum.eget-gaardsbruk-type-gaardsbruk.svar.dyr",
      "faktum.eget-gaardsbruk-type-gaardsbruk.svar.jord",
    ];

    const mockedSvaralternativText1 = {
      textId: "faktum.eget-gaardsbruk-type-gaardsbruk.svar.dyr",
      text: "Dyrehold",
    };

    const mockedSvaralternativText2 = {
      textId: "faktum.eget-gaardsbruk-type-gaardsbruk.svar.jord",
      text: "Jordbruk",
    };

    render(
      <MockContext
        sanityTexts={{
          ...mockSanityTexts,
          svaralternativer: [mockedSvaralternativText1, mockedSvaralternativText2],
        }}
      >
        <FaktumFlervalgReadOnly faktum={{ ...faktumMockData, svar }} />
      </MockContext>,
    );

    expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
    expect(screen.queryByText(mockedSvaralternativText1.text)).toBeInTheDocument();
    expect(screen.queryByText(mockedSvaralternativText2.text)).toBeInTheDocument();
  });
});
