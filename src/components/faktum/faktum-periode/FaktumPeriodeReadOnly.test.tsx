import { render, screen } from "@testing-library/react";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../../types/quiz.types";
import { MockContext } from "../../../__mocks__/MockContext";
import { FaktumPeriodeReadOnly } from "./FaktumPeriodeReadOnly";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  id: "8001",
  type: "periode",
  readOnly: false,
  beskrivendeId: "faktum.arbeidsforhold",
  sannsynliggjoresAv: [],
};

describe("FaktumPeriodeReadOnly", () => {
  test("Should show faktum question and datepicker", async () => {
    const svar = { fom: "2022-08-04", tom: "2022-08-06" };
    render(
      <MockContext>
        <FaktumPeriodeReadOnly faktum={{ ...faktumMockData, svar }} />
      </MockContext>,
    );

    expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
    expect(screen.queryByText("4. august 2022")).toBeInTheDocument();
    expect(screen.queryByText("6. august 2022")).toBeInTheDocument();
  });
});
