import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { FaktumDato } from "./FaktumDato";
import { IQuizGeneratorFaktum, IQuizSeksjon, QuizFaktum } from "../../types/quiz.types";
import userEvent from "@testing-library/user-event";
import { MockContext } from "../../__mocks__/MockContext";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  id: "8001",
  type: "localdate",
  readOnly: false,
  beskrivendeId: "faktum.dagpenger-soknadsdato",
  sannsynliggjoresAv: [],
};

const sectionMockData: IQuizSeksjon = {
  fakta: [faktumMockData],
  beskrivendeId: "din-situasjon",
  ferdig: true,
};

describe("FaktumDato", () => {
  // Undo any answer after each test
  beforeEach(() => (faktumMockData.svar = undefined));

  test("Should show faktum question and datepicker", async () => {
    render(
      <MockContext quizSeksjoner={[sectionMockData]}>
        <FaktumDato faktum={faktumMockData} />
      </MockContext>
    );

    const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId);

    await waitFor(() => {
      expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
      expect(datepicker).toBeInTheDocument();
    });
  });

  test("Should show preselected faktum answer if it's already selected", async () => {
    const svar = "2022-08-04";
    faktumMockData.svar = svar;

    render(
      <MockContext quizSeksjoner={[sectionMockData]}>
        <FaktumDato faktum={faktumMockData} />
      </MockContext>
    );

    // Casting it to access the value attribute
    const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;

    await waitFor(() => {
      expect(datepicker.value).toBe(svar);
    });
  });

  describe("When user selects an answer", () => {
    test("Should post the answer to the server", async () => {
      const user = userEvent.setup();
      const svar = "2022-08-04";
      const onchange = jest.fn();

      render(
        <MockContext quizSeksjoner={[sectionMockData]}>
          <FaktumDato faktum={faktumMockData} onChange={onchange} />
        </MockContext>
      );

      const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;

      // To trigger correct behavior as explained here: https://github.com/testing-library/user-event/issues/399#issuecomment-815664027
      await user.clear(datepicker);
      await user.type(datepicker, svar);

      await waitFor(() => {
        expect(onchange).toBeCalledTimes(1);
        expect(onchange).toBeCalledWith(faktumMockData, svar);
      });
    });
  });
});
