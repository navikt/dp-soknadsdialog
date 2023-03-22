import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../../types/quiz.types";
import { MockContext } from "../../../__mocks__/MockContext";
import { FaktumEgetGaardsbrukArbeidsaar } from "./FaktumEgetGaardsbrukArbeidsaar";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  id: "3014",
  svar: 2023,
  type: "int",
  roller: ["søker"],
  readOnly: false,
  beskrivendeId: "faktum.eget-gaardsbruk-arbeidsaar-for-timer",
  sannsynliggjoresAv: [],
};

describe("FaktumEgetGaardsbrukArbeidsaar", () => {
  beforeEach(() => (faktumMockData.svar = undefined));

  test("Should show faktum question and choices", async () => {
    render(
      <MockContext>
        <FaktumEgetGaardsbrukArbeidsaar faktum={faktumMockData} />
      </MockContext>
    );

    await waitFor(() => {
      expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
    });
  });

  test("Should pre selected 2023, when faktum.svar is 2023", async () => {
    render(
      <MockContext>
        <FaktumEgetGaardsbrukArbeidsaar faktum={faktumMockData} />
      </MockContext>
    );

    const dropdown = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLSelectElement;
    const dropdownOption = screen.getByRole("option", { name: "2023" });

    userEvent.selectOptions(dropdown, dropdownOption);

    await waitFor(() => {
      //@ts-ignore
      expect(screen.getByRole("option", { name: "2023" }).selected).toBe(true);
    });
  });
});
