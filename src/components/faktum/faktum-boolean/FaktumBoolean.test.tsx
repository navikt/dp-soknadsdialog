import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { booleanToTextId, FaktumBoolean, textIdToBoolean } from "./FaktumBoolean";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../../types/quiz.types";
import userEvent from "@testing-library/user-event";

import { MockContext } from "../../../__mocks__/MockContext";
import { mockSaveFaktumToQuiz } from "../../../__mocks__/MockQuizProvider";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  id: "8007.1",
  type: "boolean",
  readOnly: false,
  gyldigeValg: [
    "faktum.arbeidsforhold.kjent-antall-timer-jobbet.svar.ja",
    "faktum.arbeidsforhold.kjent-antall-timer-jobbet.svar.nei",
  ],
  beskrivendeId: "faktum.arbeidsforhold.kjent-antall-timer-jobbet",
  sannsynliggjoresAv: [],
};

describe("FaktumBoolean", () => {
  // Undo any answer after each test
  beforeEach(() => (faktumMockData.svar = undefined));

  test("Should show faktum question and answers", async () => {
    render(
      <MockContext>
        <FaktumBoolean faktum={faktumMockData} />
      </MockContext>,
    );
    await waitFor(() => {
      expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
      expect(screen.queryByText(faktumMockData.gyldigeValg[0])).toBeInTheDocument();
      expect(screen.queryByText(faktumMockData.gyldigeValg[1])).toBeInTheDocument();
    });
  });

  test("Should show preselected faktum answer if it's already selected", async () => {
    faktumMockData.svar = true;

    render(
      <MockContext>
        <FaktumBoolean faktum={faktumMockData} />
      </MockContext>,
    );

    // Casting it to access the value attribute
    const checkedRadio = screen.getByRole("radio", { checked: true }) as HTMLInputElement;
    const svarLabel = booleanToTextId(faktumMockData);

    await waitFor(() => {
      expect(checkedRadio.value).toBe("faktum.arbeidsforhold.kjent-antall-timer-jobbet.svar.ja");
      expect(svarLabel).toBe("faktum.arbeidsforhold.kjent-antall-timer-jobbet.svar.ja");
    });
  });

  describe("When user selects an answer", () => {
    test("Should post the answer to the server", async () => {
      const user = userEvent.setup();
      const svar = faktumMockData.gyldigeValg[1];
      const booleanSvar = textIdToBoolean(svar);

      render(
        <MockContext mockQuizContext={true}>
          <FaktumBoolean faktum={faktumMockData} />
        </MockContext>,
      );

      const radioToClick = screen.getByLabelText(svar);

      user.click(radioToClick);

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
        expect(mockSaveFaktumToQuiz).toBeCalledWith(faktumMockData, booleanSvar);
      });
    });
  });
});
