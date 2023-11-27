import { render, screen } from "@testing-library/react";
import { IQuizTekstFaktum } from "../../../types/quiz.types";
import { MockContext } from "../../../__mocks__/MockContext";
import { FaktumTextReadOnly } from "./FaktumTextReadOnly";

const faktumMockData: IQuizTekstFaktum = {
  id: "8004.1",
  svar: "as",
  type: "tekst",
  readOnly: false,
  beskrivendeId: "faktum.arbeidsforhold.navn-bedrift",
  sannsynliggjoresAv: [],
  roller: [],
};

describe("FaktumTextReadOnly", () => {
  test("Should show faktum question and answers", async () => {
    const svar = "Rema 1000";

    render(
      <MockContext>
        <FaktumTextReadOnly faktum={{ ...faktumMockData, svar }} />
      </MockContext>,
    );

    expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
    expect(screen.queryByText(svar)).toBeInTheDocument();
  });
});
