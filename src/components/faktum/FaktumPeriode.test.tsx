import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { FaktumPeriode } from "./FaktumPeriode";
import { SanityProvider } from "../../context/sanity-context";
import { IQuizGeneratorFaktum, IQuizSeksjon, IQuizState, QuizFaktum } from "../../types/quiz.types";
import { QuizProvider } from "../../context/quiz-context";
import userEvent from "@testing-library/user-event";
import { sanityMocks } from "../../__mocks__/sanity.mocks";
import { ValidationProvider } from "../../context/validation-context";
import { addDays, format, formatISO } from "date-fns";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  id: "8001",
  type: "periode",
  readOnly: false,
  beskrivendeId: "faktum.arbeidsforhold",
  sannsynliggjoresAv: [],
};

const sectionMockData: IQuizSeksjon = {
  fakta: [faktumMockData],
  beskrivendeId: "din-situasjon",
  ferdig: true,
};

const soknadStateMockData: IQuizState = {
  ferdig: false,
  antallSeksjoner: 11,
  seksjoner: [sectionMockData],
};

describe("FaktumPeriode", () => {
  // Undo any answer after each test
  beforeEach(() => (faktumMockData.svar = undefined));

  test("Should show faktum question and datepicker", async () => {
    render(
      <SanityProvider initialState={sanityMocks}>
        <QuizProvider initialState={soknadStateMockData}>
          <ValidationProvider>
            <FaktumPeriode faktum={faktumMockData} />
          </ValidationProvider>
        </QuizProvider>
      </SanityProvider>
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
      <SanityProvider initialState={sanityMocks}>
        <QuizProvider initialState={soknadStateMockData}>
          <ValidationProvider>
            <FaktumPeriode faktum={faktumMockData} />
          </ValidationProvider>
        </QuizProvider>
      </SanityProvider>
    );

    // Casting it to access the value attribute
    const datepickerFom = screen.getByLabelText(
      faktumMockData.beskrivendeId + ".fra"
    ) as HTMLInputElement;
    const datepickerTom = screen.getByLabelText(
      faktumMockData.beskrivendeId + ".til"
    ) as HTMLInputElement;

    await waitFor(() => {
      expect(datepickerFom.value).toBe(datePickerFormattedDate.fom);
      expect(datepickerTom.value).toBe(datePickerFormattedDate.tom);
    });
  });

  describe("When user selects an from date", () => {
    test("Should post selected from date to the server", async () => {
      const user = userEvent.setup();
      const onchange = jest.fn();

      render(
        <SanityProvider initialState={sanityMocks}>
          <QuizProvider initialState={soknadStateMockData}>
            <ValidationProvider>
              <FaktumPeriode faktum={faktumMockData} onChange={onchange} />
            </ValidationProvider>
          </QuizProvider>
        </SanityProvider>
      );

      const datepickerFom = screen.getByLabelText(faktumMockData.beskrivendeId + ".fra");

      // To trigger correct behavior as explained here: https://github.com/testing-library/user-event/issues/399#issuecomment-815664027
      await user.type(datepickerFom, "04.08.2022");

      await waitFor(() => {
        expect(onchange).toBeCalledTimes(1);
        expect(onchange).toHaveBeenCalledWith(faktumMockData, { fom: "2022-08-04" });
      });
    });
  });

  describe("When user adds tom date to existing periode answer with just fom date", () => {
    test("Should post post fom and tom date to server", async () => {
      const svar = { fom: "2022-08-04" };
      faktumMockData.svar = svar;

      const user = userEvent.setup();
      const onchange = jest.fn();

      render(
        <SanityProvider initialState={sanityMocks}>
          <QuizProvider initialState={soknadStateMockData}>
            <ValidationProvider>
              <FaktumPeriode faktum={faktumMockData} onChange={onchange} />
            </ValidationProvider>
          </QuizProvider>
        </SanityProvider>
      );

      const datepickerFom = screen.getByLabelText(
        faktumMockData.beskrivendeId + ".fra"
      ) as HTMLInputElement;

      const datepickerTom = screen.getByLabelText(
        faktumMockData.beskrivendeId + ".til"
      ) as HTMLInputElement;

      await waitFor(() => {
        expect(datepickerFom.value).toBe("04.08.2022");
      });

      await user.type(datepickerTom, "06.08.2022");

      await waitFor(() => {
        expect(onchange).toBeCalledTimes(1);
        expect(onchange).toHaveBeenCalledWith(faktumMockData, {
          fom: "2022-08-04",
          tom: "2022-08-06",
        });
      });
    });
  });

  describe("When user selects tom date that is before fom date", () => {
    test("Should post just fom date to server and clear tom date", async () => {
      const svar = { fom: "2022-08-04", tom: "2022-09-05" };
      faktumMockData.svar = svar;

      const user = userEvent.setup();
      const onchange = jest.fn();

      render(
        <SanityProvider initialState={sanityMocks}>
          <QuizProvider initialState={soknadStateMockData}>
            <ValidationProvider>
              <FaktumPeriode faktum={faktumMockData} onChange={onchange} />
            </ValidationProvider>
          </QuizProvider>
        </SanityProvider>
      );

      const datepickerFom = screen.getByLabelText(
        faktumMockData.beskrivendeId + ".fra"
      ) as HTMLInputElement;

      const datepickerTom = screen.getByLabelText(
        faktumMockData.beskrivendeId + ".til"
      ) as HTMLInputElement;

      const datePickerError = document.querySelector(
        ".navds-form-field__error"
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

  describe("When user selects in future date on the employment relationship", () => {
    test("Should should show error message", async () => {
      const user = userEvent.setup();
      const onchange = jest.fn();

      const tenDaysFromNow = addDays(new Date(), 10);
      const datePickerFormattedDate = format(tenDaysFromNow, "dd.MM.yyyy");

      render(
        <SanityProvider initialState={sanityMocks}>
          <QuizProvider initialState={soknadStateMockData}>
            <ValidationProvider>
              <FaktumPeriode faktum={faktumMockData} onChange={onchange} />
            </ValidationProvider>
          </QuizProvider>
        </SanityProvider>
      );

      const datepickerFom = screen.getByLabelText(
        faktumMockData.beskrivendeId + ".fra"
      ) as HTMLInputElement;

      const datePickerError = document.querySelector(
        ".navds-form-field__error"
      ) as HTMLInputElement;

      await user.type(datepickerFom, datePickerFormattedDate);

      await waitFor(() => {
        expect(datePickerError).toBeInTheDocument();
      });
    });
  });

  describe("When user selects too old date on start of the employment relationship", () => {
    test("Should should show error message", async () => {
      const user = userEvent.setup();
      const onchange = jest.fn();

      render(
        <SanityProvider initialState={sanityMocks}>
          <QuizProvider initialState={soknadStateMockData}>
            <ValidationProvider>
              <FaktumPeriode faktum={faktumMockData} onChange={onchange} />
            </ValidationProvider>
          </QuizProvider>
        </SanityProvider>
      );

      const datepickerFom = screen.getByLabelText(
        faktumMockData.beskrivendeId + ".fra"
      ) as HTMLInputElement;

      const datePickerError = document.querySelector(
        ".navds-form-field__error"
      ) as HTMLInputElement;

      await user.type(datepickerFom, "01.01.1800");

      await waitFor(() => {
        expect(datePickerError).toBeInTheDocument();
      });
    });
  });

  describe("When user selects from date too far in the future", () => {
    test("Should should show error message", async () => {
      const user = userEvent.setup();
      const onchange = jest.fn();

      render(
        <SanityProvider initialState={sanityMocks}>
          <QuizProvider initialState={soknadStateMockData}>
            <ValidationProvider>
              <FaktumPeriode faktum={faktumMockData} onChange={onchange} />
            </ValidationProvider>
          </QuizProvider>
        </SanityProvider>
      );

      const datepickerFom = screen.getByLabelText(
        faktumMockData.beskrivendeId + ".fra"
      ) as HTMLInputElement;

      const datePickerError = document.querySelector(
        ".navds-form-field__error"
      ) as HTMLInputElement;

      await user.type(datepickerFom, "06.08.3022");

      await waitFor(() => {
        expect(datePickerError).toBeInTheDocument();
      });
    });
  });

  describe("When user selects future date for specialCase faktum", () => {
    // faktum.arbeidsforhold.naar-var-lonnsplikt-periode or faktum.arbeidsforhold.permittert-periode
    test("Should should show error message", async () => {
      faktumMockData.beskrivendeId = "faktum.arbeidsforhold.naar-var-lonnsplikt-periode";

      const tenDaysFromNow = addDays(new Date(), 10);
      const datePickerFormattedDate = format(tenDaysFromNow, "dd.MM.yyyy");
      const isoFormattedDate = formatISO(tenDaysFromNow, { representation: "date" });

      const user = userEvent.setup();
      const onchange = jest.fn();

      render(
        <SanityProvider initialState={sanityMocks}>
          <QuizProvider initialState={soknadStateMockData}>
            <ValidationProvider>
              <FaktumPeriode faktum={faktumMockData} onChange={onchange} />
            </ValidationProvider>
          </QuizProvider>
        </SanityProvider>
      );

      const datepickerFom = screen.getByLabelText(
        faktumMockData.beskrivendeId + ".fra"
      ) as HTMLInputElement;

      await user.type(datepickerFom, datePickerFormattedDate);

      await waitFor(() => {
        expect(onchange).toBeCalledTimes(1);
        expect(onchange).toHaveBeenCalledWith(faktumMockData, {
          fom: isoFormattedDate,
        });
      });
    });
  });
});
