import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../../types/quiz.types";
import { MockContext } from "../../../__mocks__/MockContext";
import { mockSaveFaktumToQuiz } from "../../../__mocks__/MockQuizProvider";
import { FaktumNumber } from "./FaktumNumber";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  beskrivendeId: "faktum.barn-inntekt",
  id: "1016",
  type: "int",
  readOnly: false,
  sannsynliggjoresAv: [],
};

describe("FaktumNumber", () => {
  // Undo any answer after each test
  beforeEach(() => (faktumMockData.svar = undefined));

  test("Should show faktum question and answers", async () => {
    render(
      <MockContext>
        <FaktumNumber faktum={faktumMockData} />
      </MockContext>
    );

    await waitFor(() => {
      expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
    });
  });

  test("Should show preselected faktum answer if it's already selected", async () => {
    const svar = 12;
    faktumMockData.svar = svar;

    render(
      <MockContext>
        <FaktumNumber faktum={faktumMockData} />
      </MockContext>
    );

    // Casting it to access the value attribute
    const textInput = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;

    await waitFor(() => {
      expect(parseInt(textInput.value)).toBe(svar); // textInput.value outputs string by default
    });
  });

  describe("When user types an answer", () => {
    test("Should post the answer to the server", async () => {
      const user = userEvent.setup();
      const svar = 14;

      render(
        <MockContext mockQuizContext={true}>
          <FaktumNumber faktum={faktumMockData} />
        </MockContext>
      );

      const numberInput = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;

      await user.type(numberInput, svar + "");

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toHaveBeenCalledTimes(1);
        expect(mockSaveFaktumToQuiz).toHaveBeenCalledWith(faktumMockData, svar);
      });
    });
  });

  describe("When user tyeps an invalid answer", () => {
    test("Should show error message when typing none number character", async () => {
      const user = userEvent.setup();

      render(
        <MockContext>
          <FaktumNumber faktum={faktumMockData} />
        </MockContext>
      );

      const numberInput = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      await user.type(numberInput, "AAA");

      await waitFor(() => {
        expect(
          screen.queryByText("validering.number-faktum.maa-vaere-et-tall")
        ).toBeInTheDocument();
      });
    });

    test("Should show error message when typing negativ number", async () => {
      const user = userEvent.setup();

      render(
        <MockContext>
          <FaktumNumber faktum={faktumMockData} />
        </MockContext>
      );

      const numberInput = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      await user.type(numberInput, "-30");

      await waitFor(() => {
        expect(
          screen.queryByText("validering.number-faktum.ikke-negativt-tall")
        ).toBeInTheDocument();
      });
    });
  });
});
