import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { FaktumFlervalg } from "./FaktumFlervalg";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../types/quiz.types";
import userEvent from "@testing-library/user-event";
import { MockContext } from "../../__mocks__/MockContext";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  id: "3008",
  type: "flervalg",
  readOnly: false,
  gyldigeValg: [
    "faktum.eget-gaardsbruk-type-gaardsbruk.svar.dyr",
    "faktum.eget-gaardsbruk-type-gaardsbruk.svar.jord",
    "faktum.eget-gaardsbruk-type-gaardsbruk.svar.skog",
    "faktum.eget-gaardsbruk-type-gaardsbruk.svar.annet",
  ],
  beskrivendeId: "faktum.eget-gaardsbruk-type-gaardsbruk",
  sannsynliggjoresAv: [],
};

describe("FaktumFlervalg", () => {
  // Undo any answer after each test
  beforeEach(() => (faktumMockData.svar = undefined));

  test("Should show faktum question and answers", async () => {
    render(
      <MockContext>
        <FaktumFlervalg faktum={faktumMockData} />
      </MockContext>
    );

    await waitFor(() => {
      expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
      expect(screen.queryByText(faktumMockData.gyldigeValg[0])).toBeInTheDocument();
      expect(screen.queryByText(faktumMockData.gyldigeValg[1])).toBeInTheDocument();
      expect(screen.queryByText(faktumMockData.gyldigeValg[2])).toBeInTheDocument();
      expect(screen.queryByText(faktumMockData.gyldigeValg[3])).toBeInTheDocument();
    });
  });

  test("Should show preselected faktum answer if it's already selected", async () => {
    const svar: string[] = [];
    svar.push(faktumMockData.gyldigeValg[1]);
    svar.push(faktumMockData.gyldigeValg[2]);
    faktumMockData.svar = svar;

    render(
      <MockContext>
        <FaktumFlervalg faktum={faktumMockData} />
      </MockContext>
    );

    // Casting it to access the value attribute
    const checkedRadio = screen.queryAllByRole("checkbox", { checked: true }) as HTMLInputElement[];

    await waitFor(() => {
      expect(checkedRadio[0].value).toBe(svar[0]);
      expect(checkedRadio[1].value).toBe(svar[1]);
    });
  });

  describe("When user selects an answer", () => {
    test("Should post the answer to the server", async () => {
      const user = userEvent.setup();
      const svar = [faktumMockData.gyldigeValg[1]];
      const onchange = jest.fn();

      render(
        <MockContext>
          <FaktumFlervalg faktum={faktumMockData} onChange={onchange} />
        </MockContext>
      );

      const svarCheckbox = screen.getByLabelText(svar[0]);

      user.click(svarCheckbox);

      await waitFor(() => {
        expect(onchange).toBeCalledTimes(1);
        expect(onchange).toHaveBeenCalledWith(faktumMockData, svar);
      });
    });

    test("Can select multiple answers", async () => {
      const user = userEvent.setup();
      const svar = [faktumMockData.gyldigeValg[1], faktumMockData.gyldigeValg[2]];
      const onchange = jest.fn();

      render(
        <MockContext>
          <FaktumFlervalg faktum={faktumMockData} onChange={onchange} />
        </MockContext>
      );

      const svar1Checkbox = screen.getByLabelText(svar[0]);
      user.click(svar1Checkbox);

      const svar2Checkbox = screen.getByLabelText(svar[1]);
      user.click(svar2Checkbox);

      await waitFor(() => {
        expect(onchange).toHaveBeenCalledTimes(2);
        expect(onchange).toHaveBeenCalledWith(faktumMockData, svar);
      });
    });
  });
});
