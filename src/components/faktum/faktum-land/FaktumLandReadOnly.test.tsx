import React from "react";
import { render, screen } from "@testing-library/react";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../../types/quiz.types";
import { getCountryName } from "../../../utils/country.utils";
import { MockContext } from "../../../__mocks__/MockContext";
import { FaktumLandReadOnly } from "./FaktumLandReadOnly";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  id: "6001",
  type: "land",
  grupper: [
    {
      land: ["AUT", "HUN"],
      gruppeId: "faktum.hvilket-land-bor-barnet-ditt-i.gruppe.eøs",
    },
  ],
  readOnly: false,
  gyldigeLand: ["AUT", "HUN"],
  beskrivendeId: "faktum.hvilket-land-bor-du-i",
  sannsynliggjoresAv: [],
};

describe("FaktumLandReadOnly", () => {
  test("Should show faktum question and answers", async () => {
    const svar = "AUT";
    const svarText = getCountryName(svar, "no");
    render(
      <MockContext>
        <FaktumLandReadOnly faktum={{ ...faktumMockData, svar }} />
      </MockContext>
    );

    expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
    expect(screen.queryByText(svarText)).toBeInTheDocument();
  });
});
