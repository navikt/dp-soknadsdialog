import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { FaktumNumber } from "./FaktumNumber";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../types/quiz.types";
import userEvent from "@testing-library/user-event";
import { MockContext } from "../../__mocks__/MockContext";

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

  describe("When user selects an answer", () => {
    test("Should post the answer to the server", async () => {
      const user = userEvent.setup();
      const svar = 14;
      const onchange = jest.fn();

      render(
        <MockContext>
          <FaktumNumber faktum={faktumMockData} onChange={onchange} />
        </MockContext>
      );

      const textInput = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;

      await user.type(textInput, svar + "");

      await waitFor(() => {
        expect(onchange).toHaveBeenCalledTimes(1);
        expect(onchange).toHaveBeenCalledWith(faktumMockData, svar);
      });
    });
  });
});
