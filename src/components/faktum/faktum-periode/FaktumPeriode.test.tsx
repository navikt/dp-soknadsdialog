import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { addDays, format, formatISO } from "date-fns";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../../types/quiz.types";
import { MockContext } from "../../../__mocks__/MockContext";
import { FaktumPeriode } from "./FaktumPeriode";
import { mockSaveFaktumToQuiz } from "../../../__mocks__/MockSoknadProvider";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  id: "8001",
  type: "periode",
  readOnly: false,
  beskrivendeId: "faktum.arbeidsforhold",
  sannsynliggjoresAv: [],
};

describe("FaktumPeriode", () => {
  // Undo any answer after each test
  beforeEach(() => (faktumMockData.svar = undefined));

  test("Should show faktum question and datepicker", async () => {
    render(
      <MockContext>
        <FaktumPeriode faktum={faktumMockData} />
      </MockContext>,
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

    const datePickerFormattedDate = { fom: "04.08.2022", tom: "06.08.2022" };

    render(
      <MockContext>
        <FaktumPeriode faktum={faktumMockData} />
      </MockContext>,
    );

    // Casting it to access the value attribute
    const datepickerFom = screen.getByLabelText(
      faktumMockData.beskrivendeId + ".fra",
    ) as HTMLInputElement;
    const datepickerTom = screen.getByLabelText(
      faktumMockData.beskrivendeId + ".til",
    ) as HTMLInputElement;

    await waitFor(() => {
      expect(datepickerFom.value).toBe(datePickerFormattedDate.fom);
      expect(datepickerTom.value).toBe(datePickerFormattedDate.tom);
    });
  });

  describe("When user selects from date", () => {
    test("Should post selected from date to the server", async () => {
      const user = userEvent.setup();

      render(
        <MockContext mockQuizContext={true}>
          <FaktumPeriode faktum={faktumMockData} />
        </MockContext>,
      );

      const datepickerFom = screen.getByLabelText(faktumMockData.beskrivendeId + ".fra");

      // To trigger correct behavior as explained here: https://github.com/testing-library/user-event/issues/399#issuecomment-815664027
      await user.type(datepickerFom, "04.08.2022");

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
        expect(mockSaveFaktumToQuiz).toHaveBeenCalledWith(faktumMockData, { fom: "2022-08-04" });
      });
    });
  });

  describe("When user adds tom date to existing periode answer", () => {
    test("Should post fom and tom date to server", async () => {
      const svar = { fom: "2022-08-04" };
      faktumMockData.svar = svar;

      const user = userEvent.setup();

      render(
        <MockContext mockQuizContext={true}>
          <FaktumPeriode faktum={faktumMockData} />
        </MockContext>,
      );

      const datepickerFom = screen.getByLabelText(
        faktumMockData.beskrivendeId + ".fra",
      ) as HTMLInputElement;

      const datepickerTom = screen.getByLabelText(
        faktumMockData.beskrivendeId + ".til",
      ) as HTMLInputElement;

      await waitFor(() => {
        expect(datepickerFom.value).toBe("04.08.2022");
      });

      await user.type(datepickerTom, "06.08.2022");

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
        expect(mockSaveFaktumToQuiz).toHaveBeenCalledWith(faktumMockData, {
          fom: "2022-08-04",
          tom: "2022-08-06",
        });
      });
    });
  });

  describe("When user types in tom date that is before fom date", () => {
    test("Should show error message", async () => {
      const svar = { fom: "2022-08-04", tom: "2022-09-05" };
      faktumMockData.svar = svar;

      const user = userEvent.setup();

      render(
        <MockContext>
          <FaktumPeriode faktum={faktumMockData} />
        </MockContext>,
      );

      const datepickerFom = screen.getByLabelText(
        faktumMockData.beskrivendeId + ".fra",
      ) as HTMLInputElement;

      const datepickerTom = screen.getByLabelText(
        faktumMockData.beskrivendeId + ".til",
      ) as HTMLInputElement;

      const datePickerError = document.querySelector(
        '*[id^="datepicker-input-error"]',
      ) as HTMLInputElement;

      await waitFor(() => {
        expect(datepickerFom.value).toBe("04.08.2022");
        expect(datepickerTom.value).toBe("05.09.2022");
      });

      await user.type(datepickerTom, "05.05.2022");

      await waitFor(() => {
        expect(datePickerError).toBeInTheDocument();
      });
    });
  });

  describe("When user selects future date for employment relationship start date, faktum: faktum.arbeidsforhold", () => {
    test("Should show error message", async () => {
      const user = userEvent.setup();

      const faktumArbeidsforholdMockData = {
        ...faktumMockData,
        beskrivendeId: "faktum.arbeidsforhold",
      };

      const tenDaysFromNow = addDays(new Date(), 10);
      const datePickerFormattedDate = format(tenDaysFromNow, "dd.MM.yyyy");

      render(
        <MockContext>
          <FaktumPeriode faktum={faktumArbeidsforholdMockData} />
        </MockContext>,
      );

      const datepickerFom = screen.getByLabelText(
        faktumArbeidsforholdMockData.beskrivendeId + ".fra",
      ) as HTMLInputElement;

      const datePickerError = document.querySelector(
        '*[id^="datepicker-input-error"]',
      ) as HTMLInputElement;

      await user.type(datepickerFom, datePickerFormattedDate);

      await waitFor(() => {
        expect(datePickerError).toBeInTheDocument();
      });
    });
  });

  describe("When selected date is not within 01.01.1900 and 100 year from now", () => {
    test("When types inn 01.01.1800 should show error message and not post to server", async () => {
      const user = userEvent.setup();

      render(
        <MockContext mockQuizContext={true}>
          <FaktumPeriode faktum={faktumMockData} />
        </MockContext>,
      );

      const datepickerFom = screen.getByLabelText(
        faktumMockData.beskrivendeId + ".fra",
      ) as HTMLInputElement;

      const datePickerError = document.querySelector(
        '*[id^="datepicker-input-error"]',
      ) as HTMLInputElement;

      await user.type(datepickerFom, "01.01.1800");

      await waitFor(() => {
        expect(datePickerError).toBeInTheDocument();
        expect(mockSaveFaktumToQuiz).not.toBeCalled();
      });
    });

    test("When types in 06.06.2322 should show error message not post to server", async () => {
      const user = userEvent.setup();

      render(
        <MockContext mockQuizContext={true}>
          <FaktumPeriode faktum={faktumMockData} />
        </MockContext>,
      );

      const datepickerFom = screen.getByLabelText(
        faktumMockData.beskrivendeId + ".fra",
      ) as HTMLInputElement;

      const datePickerError = document.querySelector(
        '*[id^="datepicker-input-error"]',
      ) as HTMLInputElement;

      await user.type(datepickerFom, "06.08.2322");

      await waitFor(() => {
        expect(datePickerError).toBeInTheDocument();
        expect(mockSaveFaktumToQuiz).not.toBeCalled();
      });
    });
  });

  describe("When user selects future date for specialCase faktum", () => {
    // faktum.arbeidsforhold.naar-var-lonnsplikt-periode or faktum.arbeidsforhold.permittert-periode
    test("Should post selected date to server", async () => {
      faktumMockData.beskrivendeId = "faktum.arbeidsforhold.naar-var-lonnsplikt-periode";

      const tenDaysFromNow = addDays(new Date(), 10);
      const datePickerFormattedDate = format(tenDaysFromNow, "dd.MM.yyyy");
      const isoFormattedDate = formatISO(tenDaysFromNow, { representation: "date" });

      const user = userEvent.setup();

      render(
        <MockContext mockQuizContext={true}>
          <FaktumPeriode faktum={faktumMockData} />
        </MockContext>,
      );

      const datepickerFom = screen.getByLabelText(
        faktumMockData.beskrivendeId + ".fra",
      ) as HTMLInputElement;

      await user.type(datepickerFom, datePickerFormattedDate);

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
        expect(mockSaveFaktumToQuiz).toHaveBeenCalledWith(faktumMockData, {
          fom: isoFormattedDate,
        });
      });
    });
  });

  describe("When user clears selected date from datepicker", () => {
    test.skip("When user clears fom date from selected periode that contains fom only should post null to server", async () => {
      const svar = { fom: "2022-08-04" };
      faktumMockData.svar = svar;

      const user = userEvent.setup();

      render(
        <MockContext mockQuizContext={true}>
          <FaktumPeriode faktum={faktumMockData} />
        </MockContext>,
      );

      const datepickerFom = screen.getByLabelText(
        faktumMockData.beskrivendeId + ".fra",
      ) as HTMLInputElement;

      await user.clear(datepickerFom);

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
        expect(mockSaveFaktumToQuiz).toHaveBeenCalledWith(faktumMockData, null);
      });
    });

    test.skip("When user clears fom date from selected periode that contains both fom and tom should post null to server", async () => {
      const svar = { fom: "2022-08-04", tom: "2022-08-06" };
      faktumMockData.svar = svar;

      const user = userEvent.setup();

      render(
        <MockContext mockQuizContext={true}>
          <FaktumPeriode faktum={faktumMockData} />
        </MockContext>,
      );

      const datepickerFom = screen.getByLabelText(
        faktumMockData.beskrivendeId + ".fra",
      ) as HTMLInputElement;

      await user.clear(datepickerFom);

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
        expect(mockSaveFaktumToQuiz).toHaveBeenCalledWith(faktumMockData, null);
      });
    });

    test.skip("When user clears tom date from selected periode that contains both fom and tom should post fom to server alone", async () => {
      const svar = { fom: "2022-08-04", tom: "2022-08-06" };
      faktumMockData.svar = svar;

      const user = userEvent.setup();

      render(
        <MockContext mockQuizContext={true}>
          <FaktumPeriode faktum={faktumMockData} />
        </MockContext>,
      );

      const datepickerTom = screen.getByLabelText(
        faktumMockData.beskrivendeId + ".til",
      ) as HTMLInputElement;

      await user.clear(datepickerTom);

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
        expect(mockSaveFaktumToQuiz).toHaveBeenCalledWith(faktumMockData, { fom: "2022-08-04" });
      });
    });
  });
});
