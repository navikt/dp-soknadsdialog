import React from "react";
import { render, screen } from "@testing-library/react";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../../types/quiz.types";
import { MockContext } from "../../../__mocks__/MockContext";
import { FaktumNumberReadOnly } from "./FaktumNumberReadOnly";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  beskrivendeId: "faktum.barn-inntekt",
  id: "1016",
  type: "int",
  readOnly: false,
  sannsynliggjoresAv: [],
};

describe("FaktumNumberReadOnly", () => {
  test("Should show faktum question and answers", async () => {
    const svar = 200;

    render(
      <MockContext>
        <FaktumNumberReadOnly faktum={{ ...faktumMockData, svar }} />
      </MockContext>,
    );

    expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
    expect(screen.queryByText(svar.toString())).toBeInTheDocument();
  });
});
