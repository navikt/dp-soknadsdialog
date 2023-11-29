import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { FaktumEnvalg } from "./FaktumEnvalg";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../../types/quiz.types";
import userEvent from "@testing-library/user-event";
import { MockContext } from "../../../__mocks__/MockContext";
import { mockSaveFaktumToQuiz } from "../../../__mocks__/MockQuizProvider";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  id: "10001",
  svar: "faktum.mottatt-dagpenger-siste-12-mnd.svar.nei",
  type: "envalg",
  readOnly: false,
  gyldigeValg: [
    "faktum.mottatt-dagpenger-siste-12-mnd.svar.ja",
    "faktum.mottatt-dagpenger-siste-12-mnd.svar.nei",
    "faktum.mottatt-dagpenger-siste-12-mnd.svar.vet-ikke",
  ],
  beskrivendeId: "faktum.mottatt-dagpenger-siste-12-mnd",
  sannsynliggjoresAv: [],
};

describe("FaktumEnvalg", () => {
  // Undo any answer after each test
  beforeEach(() => (faktumMockData.svar = undefined));

  test("Should show faktum question and answers", async () => {
    render(
      <MockContext>
        <FaktumEnvalg faktum={faktumMockData} />
      </MockContext>,
    );

    await waitFor(() => {
      expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
      expect(screen.queryByText(faktumMockData.gyldigeValg[0])).toBeInTheDocument();
      expect(screen.queryByText(faktumMockData.gyldigeValg[1])).toBeInTheDocument();
      expect(screen.queryByText(faktumMockData.gyldigeValg[2])).toBeInTheDocument();
    });
  });

  test("Should show preselected faktum answer if it's already selected", async () => {
    const svar = faktumMockData.gyldigeValg[2];
    faktumMockData.svar = svar;

    render(
      <MockContext>
        <FaktumEnvalg faktum={faktumMockData} />
      </MockContext>,
    );

    // Casting it to access the value attribute
    const checkedRadio = screen.getByRole("radio", { checked: true }) as HTMLInputElement;

    await waitFor(() => {
      expect(checkedRadio.value).toBe(svar);
    });
  });

  describe("When user selects an answer", () => {
    test("Should post the answer to the server", async () => {
      const user = userEvent.setup();
      const svar = faktumMockData.gyldigeValg[0];

      render(
        <MockContext mockQuizContext={true}>
          <FaktumEnvalg faktum={faktumMockData} />
        </MockContext>,
      );

      const firstRadio = screen.getByLabelText(svar);

      user.click(firstRadio);

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toHaveBeenCalledTimes(1);
        expect(mockSaveFaktumToQuiz).toBeCalledWith(faktumMockData, svar);
      });
    });
  });
});
