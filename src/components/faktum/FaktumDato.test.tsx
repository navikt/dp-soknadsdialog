import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { FaktumDato } from "./FaktumDato";
import { SanityProvider } from "../../context/sanity-context";
import { IQuizGeneratorFaktum, IQuizSeksjon, IQuizState, QuizFaktum } from "../../types/quiz.types";
import { QuizProvider } from "../../context/quiz-context";
import userEvent from "@testing-library/user-event";
import { sanityMocks } from "../../__mocks__/sanity.mocks";
import { ValidationProvider } from "../../context/validation-context";
import { addWeeks, format, formatISO } from "date-fns";

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

const soknadStateMockData: IQuizState = {
  ferdig: false,
  antallSeksjoner: 11,
  seksjoner: [sectionMockData],
};

describe("FaktumDato", () => {
  // Undo any answer after each test
  beforeEach(() => (faktumMockData.svar = undefined));

  test("Should show faktum question and datepicker", async () => {
    render(
      <SanityProvider initialState={sanityMocks}>
        <QuizProvider initialState={soknadStateMockData}>
          <ValidationProvider>
            <FaktumDato faktum={faktumMockData} />
          </ValidationProvider>
        </QuizProvider>
      </SanityProvider>
    );

    const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId);

    await waitFor(() => {
      expect(screen.queryByText(faktumMockData.beskrivendeId)).toBeInTheDocument();
      expect(datepicker).toBeInTheDocument();
    });
  });

  test("Should show preselected faktum answer if it's already selected", async () => {
    faktumMockData.svar = "2022-08-04";

    render(
      <SanityProvider initialState={sanityMocks}>
        <QuizProvider initialState={soknadStateMockData}>
          <ValidationProvider>
            <FaktumDato faktum={faktumMockData} />
          </ValidationProvider>
        </QuizProvider>
      </SanityProvider>
    );

    // Casting it to access the value attribute
    const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;

    await waitFor(() => {
      expect(datepicker.value).toBe("04.08.2022");
    });
  });

  describe("When user selects an answer", () => {
    test("Should post the answer to the server", async () => {
      const user = userEvent.setup();
      const onchange = jest.fn();

      render(
        <SanityProvider initialState={sanityMocks}>
          <QuizProvider initialState={soknadStateMockData}>
            <ValidationProvider>
              <FaktumDato faktum={faktumMockData} onChange={onchange} />
            </ValidationProvider>
          </QuizProvider>
        </SanityProvider>
      );

      const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      await user.type(datepicker, "04.08.2022");

      await waitFor(() => {
        expect(onchange).toBeCalledTimes(1);
        expect(onchange).toBeCalledWith(faktumMockData, "2022-08-04");
      });
    });
  });

  describe("When user removes an seleted date", () => {
    test("Should post null to server", async () => {
      faktumMockData.svar = "2022-08-04";
      const user = userEvent.setup();
      const onchange = jest.fn();

      render(
        <SanityProvider initialState={sanityMocks}>
          <QuizProvider initialState={soknadStateMockData}>
            <ValidationProvider>
              <FaktumDato faktum={faktumMockData} onChange={onchange} />
            </ValidationProvider>
          </QuizProvider>
        </SanityProvider>
      );

      const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      await user.clear(datepicker);

      await waitFor(() => {
        expect(onchange).toBeCalledTimes(1);
        expect(onchange).toBeCalledWith(faktumMockData, null);
      });
    });
  });

  describe("When user seleted an date three weeks from now", () => {
    test("Should post seleted date to server and display warning message", async () => {
      const threeWeeksFromNow = addWeeks(new Date(), 3);
      const datePickerFormattedDate = format(threeWeeksFromNow, "dd.MM.yyyy"); // eg: 20.11.2022
      const isoFormattedDate = formatISO(threeWeeksFromNow, { representation: "date" }); // eg 2022-11-20

      const user = userEvent.setup();
      const onchange = jest.fn();

      render(
        <SanityProvider initialState={sanityMocks}>
          <QuizProvider initialState={soknadStateMockData}>
            <ValidationProvider>
              <FaktumDato faktum={faktumMockData} onChange={onchange} />
            </ValidationProvider>
          </QuizProvider>
        </SanityProvider>
      );

      const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      await user.type(datepicker, datePickerFormattedDate);
      const warningMessage = screen.getByTestId("faktum.soknadsdato-varsel");

      await waitFor(() => {
        expect(onchange).toBeCalledTimes(1);
        expect(onchange).toBeCalledWith(faktumMockData, isoFormattedDate);
        expect(warningMessage).toBeInTheDocument();
      });
    });
  });

  describe("When user removes a date that are three weeks from now", () => {
    test("Should save null to server and removes warning message", async () => {
      const threeWeeksFromNow = addWeeks(new Date(), 3);
      const threeWeeksFromNotIsoFormatted = formatISO(threeWeeksFromNow, {
        representation: "date",
      });

      faktumMockData.svar = threeWeeksFromNotIsoFormatted;

      const user = userEvent.setup();
      const onchange = jest.fn();

      render(
        <SanityProvider initialState={sanityMocks}>
          <QuizProvider initialState={soknadStateMockData}>
            <ValidationProvider>
              <FaktumDato faktum={faktumMockData} onChange={onchange} />
            </ValidationProvider>
          </QuizProvider>
        </SanityProvider>
      );

      const warningMessage = screen.getByTestId("faktum.soknadsdato-varsel");

      await waitFor(() => {
        expect(warningMessage).toBeInTheDocument();
      });

      const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      await user.clear(datepicker);

      await waitFor(() => {
        expect(onchange).toBeCalledTimes(1);
        expect(onchange).toBeCalledWith(faktumMockData, null);
        expect(warningMessage).not.toBeInTheDocument();
      });
    });
  });

  describe("When user a types in too old date: eg 01.01.1800", () => {
    test("Should show validation text", async () => {
      const seletedDate = format(new Date("01.01.1800"), "dd.MM.yyyy");

      const user = userEvent.setup();
      const onchange = jest.fn();

      render(
        <SanityProvider initialState={sanityMocks}>
          <QuizProvider initialState={soknadStateMockData}>
            <ValidationProvider>
              <FaktumDato faktum={faktumMockData} onChange={onchange} />
            </ValidationProvider>
          </QuizProvider>
        </SanityProvider>
      );

      const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      await user.type(datepicker, seletedDate);
      const datePickerError = document.querySelector(
        ".navds-form-field__error"
      ) as HTMLInputElement;

      await waitFor(() => {
        expect(datePickerError).toBeInTheDocument();
      });
    });
  });

  describe("When user a type in different invalid date", () => {
    test("Types in 10.10.10 should post null to server", async () => {
      const user = userEvent.setup();
      const onchange = jest.fn();

      render(
        <SanityProvider initialState={sanityMocks}>
          <QuizProvider initialState={soknadStateMockData}>
            <ValidationProvider>
              <FaktumDato faktum={faktumMockData} onChange={onchange} />
            </ValidationProvider>
          </QuizProvider>
        </SanityProvider>
      );

      const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      await user.type(datepicker, "10.10.10");

      await waitFor(() => {
        expect(onchange).toBeCalledTimes(1);
        expect(onchange).toBeCalledWith(faktumMockData, null);
      });
    });

    test("Types in 10.10.10 should post null to server and show error message", async () => {
      const user = userEvent.setup();
      const onchange = jest.fn();

      render(
        <SanityProvider initialState={sanityMocks}>
          <QuizProvider initialState={soknadStateMockData}>
            <ValidationProvider>
              <FaktumDato faktum={faktumMockData} onChange={onchange} />
            </ValidationProvider>
          </QuizProvider>
        </SanityProvider>
      );

      const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      await user.type(datepicker, "10.10.10");
      const datePickerError = document.querySelector(
        ".navds-form-field__error"
      ) as HTMLInputElement;

      await waitFor(() => {
        expect(onchange).toBeCalledTimes(1);
        expect(onchange).toBeCalledWith(faktumMockData, null);
        expect(datePickerError).toBeInTheDocument();
      });
    });
  });
});
