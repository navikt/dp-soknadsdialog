import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { FaktumPeriode } from "./FaktumPeriode";
import { IQuizGeneratorFaktum, IQuizSeksjon, QuizFaktum } from "../../types/quiz.types";
import userEvent from "@testing-library/user-event";
import { SetupContext } from "../../__mocks__/SetupContext";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  id: "8001",
  type: "periode",
  readOnly: false,
  beskrivendeId: "faktum.dagpenger-soknadsdato",
  sannsynliggjoresAv: [],
};

const sectionMockData: IQuizSeksjon = {
  fakta: [faktumMockData],
  beskrivendeId: "din-situasjon",
  ferdig: true,
};

describe("FaktumPeriode", () => {
  // Undo any answer after each test
  beforeEach(() => (faktumMockData.svar = undefined));

  test("Should show faktum question and datepicker", async () => {
    render(
      <SetupContext quizSeksjoner={[sectionMockData]}>
        <FaktumPeriode faktum={faktumMockData} />
      </SetupContext>
    );

    const datepickerFom = screen.getByLabelText(faktumMockData.beskrivendeId + ".fra");
    const datepickerTom = screen.getByLabelText(faktumMockData.beskrivendeId + ".til");

    await waitFor(() => {
      expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
      expect(datepickerFom).toBeInTheDocument();
      expect(datepickerTom).toBeInTheDocument();
    });
  });

  test("Should show preselected faktum answer if it's already selected", async () => {
    const svar = { fom: "2022-08-04", tom: "2022-08-06" };
    faktumMockData.svar = svar;

    render(
      <SetupContext quizSeksjoner={[sectionMockData]}>
        <FaktumPeriode faktum={faktumMockData} />
      </SetupContext>
    );

    // Casting it to access the value attribute
    const datepickerFom = screen.getByLabelText(
      faktumMockData.beskrivendeId + ".fra"
    ) as HTMLInputElement;
    const datepickerTom = screen.getByLabelText(
      faktumMockData.beskrivendeId + ".til"
    ) as HTMLInputElement;

    await waitFor(() => {
      expect(datepickerFom.value).toBe(svar.fom);
      expect(datepickerTom.value).toBe(svar.tom);
    });
  });

  describe("When user selects an answer", () => {
    test("Should post the answer to the server", async () => {
      const user = userEvent.setup();
      const svar = { fom: "2022-08-04", tom: "2022-08-06" };
      const onchange = jest.fn();

      render(
        <SetupContext quizSeksjoner={[sectionMockData]}>
          <FaktumPeriode faktum={faktumMockData} onChange={onchange} />
        </SetupContext>
      );

      const datepickerFom = screen.getByLabelText(faktumMockData.beskrivendeId + ".fra");
      const datepickerTom = screen.getByLabelText(faktumMockData.beskrivendeId + ".til");

      // To trigger correct behavior as explained here: https://github.com/testing-library/user-event/issues/399#issuecomment-815664027
      await user.clear(datepickerFom);
      await user.type(datepickerFom, svar.fom);

      await user.clear(datepickerTom);
      await user.type(datepickerTom, svar.tom);

      await waitFor(() => {
        expect(onchange).toBeCalledTimes(2);
        expect(onchange).toHaveBeenCalledWith(faktumMockData, svar);
      });
    });
  });
});
