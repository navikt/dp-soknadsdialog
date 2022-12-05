import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { FaktumLand } from "./FaktumLand";
import { IQuizGeneratorFaktum, IQuizSeksjon, QuizFaktum } from "../../types/quiz.types";
import userEvent from "@testing-library/user-event";
import { getCountryName } from "../../country.utils";
import { SetupContext } from "../../__mocks__/SetupContext";

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

const sectionMockData: IQuizSeksjon = {
  fakta: [faktumMockData],
  beskrivendeId: "din-situasjon",
  ferdig: true,
};

describe("FaktumLand", () => {
  // Undo any answer after each test
  beforeEach(() => (faktumMockData.svar = undefined));

  test("Should show faktum question and answers", async () => {
    render(
      <SetupContext quizSeksjoner={[sectionMockData]}>
        <FaktumLand faktum={faktumMockData} />
      </SetupContext>
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
      <SetupContext quizSeksjoner={[sectionMockData]}>
        <FaktumLand faktum={faktumMockData} />
      </SetupContext>
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
      const onchange = jest.fn();

      render(
        <SetupContext quizSeksjoner={[sectionMockData]}>
          <FaktumLand faktum={faktumMockData} onChange={onchange} />
        </SetupContext>
      );

      const selectedOptionText = getCountryName(svar, "no");

      user.selectOptions(screen.getByLabelText(faktumMockData.beskrivendeId), selectedOptionText);

      await waitFor(() => {
        expect(onchange).toBeCalledTimes(1);
        expect(onchange).toBeCalledWith(faktumMockData, svar);
      });
    });
  });

  describe("When is Bodstedsland or Arbeidsforhold and faktum is unanswered", () => {
    test("Should post `NOR` to server", async () => {
      const svar = "NOR";
      const onchange = jest.fn();

      render(
        <SetupContext quizSeksjoner={[sectionMockData]}>
          <FaktumLand faktum={faktumMockDataBostedsland} onChange={onchange} />
        </SetupContext>
      );

      await waitFor(() => {
        const selectedOption = screen.getByRole("option", { selected: true }) as HTMLInputElement;
        expect(selectedOption.value).toEqual(svar);
        expect(onchange).toBeCalledTimes(1);
        expect(onchange).toBeCalledWith(faktumMockDataBostedsland, svar);
      });
    });
  });
});
