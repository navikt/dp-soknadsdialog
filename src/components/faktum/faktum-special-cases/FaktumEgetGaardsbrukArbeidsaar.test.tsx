import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../../types/quiz.types";
import { MockContext } from "../../../__mocks__/MockContext";
import { FaktumEgetGaardsbrukArbeidsaar } from "./FaktumEgetGaardsbrukArbeidsaar";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  id: "3014",
  type: "int",
  roller: ["søker"],
  readOnly: false,
  beskrivendeId: "faktum.eget-gaardsbruk-arbeidsaar-for-timer",
  sannsynliggjoresAv: [],
};

describe("FaktumEgetGaardsbrukArbeidsaar", () => {
  test("Should show faktum question and choices", async () => {
    render(
      <MockContext>
        <FaktumEgetGaardsbrukArbeidsaar faktum={faktumMockData} />
      </MockContext>,
    );

    await waitFor(() => {
      expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
    });
  });

  test("Should pre-select 2023, when faktum.svar is 2023", async () => {
    render(
      <MockContext>
        <FaktumEgetGaardsbrukArbeidsaar faktum={{ ...faktumMockData, svar: 20323 }} />
      </MockContext>,
    );

    const dropdown = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLSelectElement;
    const dropdownOption = screen.getByRole("option", { name: "2023" });

    userEvent.selectOptions(dropdown, dropdownOption);

    await waitFor(() => {
      //@ts-ignore
      expect(screen.getByRole("option", { name: "2023" }).selected).toBe(true);
    });
  });

  test("Should have this year and last four year as select options", async () => {
    render(
      <MockContext>
        <FaktumEgetGaardsbrukArbeidsaar faktum={faktumMockData} />
      </MockContext>,
    );

    const currentYear = new Date().getUTCFullYear();

    const thisYear = screen.getByRole("option", { name: `${currentYear}` });
    const minusOneYear = screen.getByRole("option", { name: `${currentYear - 1}` });
    const minusTwoYears = screen.getByRole("option", { name: `${currentYear - 2}` });
    const minusThreeYears = screen.getByRole("option", { name: `${currentYear - 3}` });
    const minusFourYears = screen.getByRole("option", { name: `${currentYear - 4}` });

    await waitFor(() => {
      expect(thisYear).toBeInTheDocument();
      expect(minusOneYear).toBeInTheDocument();
      expect(minusTwoYears).toBeInTheDocument();
      expect(minusThreeYears).toBeInTheDocument();
      expect(minusFourYears).toBeInTheDocument();
    });
  });
});
