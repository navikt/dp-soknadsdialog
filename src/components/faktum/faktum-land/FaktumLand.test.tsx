import React from "react";
import userEvent from "@testing-library/user-event";
import { render, waitFor, screen } from "@testing-library/react";
import { FaktumLand } from "./FaktumLand";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../../types/quiz.types";
import { getCountryName } from "../../../utils/country.utils";
import { MockContext } from "../../../__mocks__/MockContext";
import { mockSaveFaktumToQuiz } from "../../../__mocks__/MockQuizProvider";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  id: "6001",
  type: "land",
  grupper: [
    {
      land: [
        "AUT",
        "HUN",
        "DEU",
        "CZE",
        "SWE",
        "CHE",
        "ESP",
        "SVN",
        "SVK",
        "ROU",
        "PRT",
        "BGR",
        "BEL",
      ],
      gruppeId: "faktum.hvilket-land-bor-barnet-ditt-i.gruppe.eøs",
    },
    {
      land: ["SJM", "NOR"],
      gruppeId: "faktum.hvilket-land-bor-barnet-ditt-i.gruppe.norge-jan-mayen",
    },
    {
      land: ["IMN", "JEY", "GBR"],
      gruppeId: "faktum.hvilket-land-bor-barnet-ditt-i.gruppe.storbritannia",
    },
  ],
  readOnly: false,
  gyldigeLand: [
    "AUT",
    "HUN",
    "DEU",
    "CZE",
    "SWE",
    "CHE",
    "ESP",
    "SVN",
    "SVK",
    "ROU",
    "PRT",
    "BGR",
    "BEL",
    "SJM",
    "NOR",
    "IMN",
    "JEY",
    "GBR",
  ],
  beskrivendeId: "faktum.hvilket-land-bor-barnet-ditt-i",
  sannsynliggjoresAv: [],
};

const faktumMockDataBostedsland = {
  ...faktumMockData,
  beskrivendeId: "faktum.hvilket-land-bor-du-i",
};

describe("FaktumLand", () => {
  // Undo any answer after each test
  beforeEach(() => (faktumMockData.svar = undefined));

  test("Should show faktum question and answers", async () => {
    render(
      <MockContext>
        <FaktumLand faktum={faktumMockData} />
      </MockContext>,
    );

    const option1 = getCountryName(faktumMockData.gyldigeLand[0], "no");
    const option2 = getCountryName(faktumMockData.gyldigeLand[1], "no");
    const option3 = getCountryName(faktumMockData.gyldigeLand[2], "no");

    await waitFor(() => {
      expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
      expect(screen.queryByText(option1)).toBeInTheDocument();
      expect(screen.queryByText(option2)).toBeInTheDocument();
      expect(screen.queryByText(option3)).toBeInTheDocument();
    });
  });

  test("Should show preselected faktum answer if it's already selected", async () => {
    const svar = faktumMockData.gyldigeLand[2];
    faktumMockData.svar = svar;

    render(
      <MockContext>
        <FaktumLand faktum={faktumMockData} />
      </MockContext>,
    );

    // Casting it to access the value attribute
    const selectedOption = screen.getByRole("option", { selected: true }) as HTMLInputElement;
    const selectedOptionText = getCountryName(selectedOption.value, "no");

    await waitFor(() => {
      expect(selectedOption.value).toBe(svar);
      expect(selectedOption.textContent).toBe(selectedOptionText);
    });
  });

  describe("When user selects an answer ", () => {
    test("Should post it to the server", async () => {
      const user = userEvent.setup();
      const svar = faktumMockDataBostedsland.gyldigeLand[14];

      render(
        <MockContext mockQuizContext={true}>
          <FaktumLand faktum={faktumMockData} />
        </MockContext>,
      );

      const selectedOptionText = getCountryName(svar, "no");

      user.selectOptions(screen.getByLabelText(faktumMockData.beskrivendeId), selectedOptionText);

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
        expect(mockSaveFaktumToQuiz).toBeCalledWith(faktumMockData, svar);
      });
    });
  });

  describe("When is Bodstedsland or Arbeidsforhold and faktum is unanswered", () => {
    test("Should post `NOR` to server", async () => {
      const svar = "NOR";

      render(
        <MockContext mockQuizContext={true}>
          <FaktumLand faktum={faktumMockDataBostedsland} />
        </MockContext>,
      );

      await waitFor(() => {
        const selectedOption = screen.getByRole("option", { selected: true }) as HTMLInputElement;
        expect(selectedOption.value).toEqual(svar);
        expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
        expect(mockSaveFaktumToQuiz).toBeCalledWith(faktumMockDataBostedsland, svar);
      });
    });
  });
});
