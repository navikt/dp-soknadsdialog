import { render, screen } from "@testing-library/react";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../../types/quiz.types";
import { MockContext } from "../../../__mocks__/MockContext";
import { FaktumDatoReadOnly } from "./FaktumDatoReadOnly";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  id: "8001",
  type: "localdate",
  readOnly: false,
  beskrivendeId: "faktum.dagpenger-soknadsdato",
  sannsynliggjoresAv: [],
};

describe("FaktumDatoReadOnly", () => {
  test("Should show faktum question and datepicker", async () => {
    const svar = "2022-11-20";
    const faktumToTest = { ...faktumMockData, svar };
    render(
      <MockContext>
        <FaktumDatoReadOnly faktum={faktumToTest} />
      </MockContext>
    );

    expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
    expect(screen.queryByText("20. november 2022")).toBeInTheDocument();
  });
});
