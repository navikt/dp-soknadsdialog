import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { addMonths, addWeeks, addYears, format, formatISO, subMonths, subYears } from "date-fns";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../../types/quiz.types";
import { MockContext } from "../../../__mocks__/MockContext";
import { mockSaveFaktumToQuiz } from "../../../__mocks__/MockQuizProvider";
import { FaktumDato } from "./FaktumDato";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  id: "8001",
  type: "localdate",
  readOnly: false,
  beskrivendeId: "faktum.arbeidsforhold.midlertidig-arbeidsforhold-med-sluttdato",
  sannsynliggjoresAv: [],
};

describe("FaktumDato", () => {
  // Undo any answer after each test
  beforeEach(() => (faktumMockData.svar = undefined));

  test("Should show faktum question and datepicker", async () => {
    render(
      <MockContext>
        <FaktumDato faktum={faktumMockData} />
      </MockContext>,
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
      <MockContext>
        <FaktumDato faktum={faktumMockData} />
      </MockContext>,
    );

    // Casting it to access the value attribute
    const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;

    await waitFor(() => {
      expect(datepicker.value).toBe("04.08.2022");
    });
  });

  describe("When user selects an answer", () => {
    // Error
    test("Should post the answer to the server", async () => {
      const user = userEvent.setup();

      render(
        <MockContext mockQuizContext={true}>
          <FaktumDato faktum={faktumMockData} />
        </MockContext>,
      );

      const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      await user.type(datepicker, "04.08.2022");

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
        expect(mockSaveFaktumToQuiz).toBeCalledWith(faktumMockData, "2022-08-04");
      });
    });
  });

  describe("When user removes an seleted date", () => {
    test("Should call saveFaktum and post null to server", async () => {
      faktumMockData.svar = "2022-08-04";
      const user = userEvent.setup();

      render(
        <MockContext mockQuizContext={true}>
          <FaktumDato faktum={faktumMockData} />
        </MockContext>,
      );

      const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      await user.clear(datepicker);

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
        expect(mockSaveFaktumToQuiz).toBeCalledWith(faktumMockData, null);
      });
    });
  });

  describe("When selected date is not within 01.01.1900 and 100 year from now", () => {
    test("Selecting a date two hundret years from now should show error message and not post null server", async () => {
      const twoHundredYearsFromNow = addYears(new Date(), 200);
      const datePickerFormattedDate = format(twoHundredYearsFromNow, "dd.MM.yyyy");

      const user = userEvent.setup();

      render(
        <MockContext mockQuizContext={true}>
          <FaktumDato faktum={faktumMockData} />
        </MockContext>,
      );

      const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      await user.type(datepicker, datePickerFormattedDate);
      const datePickerError = document.querySelector(
        '*[id^="datepicker-input-error"]',
      ) as HTMLInputElement;
      await user.type(datepicker, datePickerFormattedDate);

      await waitFor(() => {
        expect(datePickerError).toBeInTheDocument();
        expect(mockSaveFaktumToQuiz).toBeCalledWith(faktumMockData, null);
      });
    });

    test("Selecting a date two hundret years before now should show error message and post null to server", async () => {
      const twoHundredYearsFromNow = subYears(new Date(), -200);
      const datePickerFormattedDate = format(twoHundredYearsFromNow, "dd.MM.yyyy");

      const user = userEvent.setup();

      render(
        <MockContext mockQuizContext={true}>
          <FaktumDato faktum={faktumMockData} />
        </MockContext>,
      );

      const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      await user.type(datepicker, datePickerFormattedDate);
      const datePickerError = document.querySelector(
        '*[id^="datepicker-input-error"]',
      ) as HTMLInputElement;
      await user.type(datepicker, datePickerFormattedDate);

      await waitFor(() => {
        expect(datePickerError).toBeInTheDocument();
        expect(mockSaveFaktumToQuiz).toBeCalledWith(faktumMockData, null);
      });
    });
  });

  // Feilet
  describe("When user types in date without dot between date, month and year on datepicker. Eg. 10102022", () => {
    test("Should post 2022-10-10 to server because DDMMYYYY is also a valid format", async () => {
      const user = userEvent.setup();

      render(
        <MockContext mockQuizContext={true}>
          <FaktumDato faktum={faktumMockData} />
        </MockContext>,
      );

      const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      await user.type(datepicker, "10102022");

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
        expect(mockSaveFaktumToQuiz).toBeCalledWith(faktumMockData, "2022-10-10");
      });
    });
  });

  describe("When user types in different invalid date formats. Valid format is DDMMYYY, DD.MM.YYYY, DDMMYY or DD.MM.YY", () => {
    test("Types in 10.10 should call saveFaktum, post null to server and show error message", async () => {
      const user = userEvent.setup();

      render(
        <MockContext mockQuizContext={true}>
          <FaktumDato faktum={faktumMockData} />
        </MockContext>,
      );

      const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      const datePickerError = document.querySelector(
        '*[id^="datepicker-input-error"]',
      ) as HTMLInputElement;
      await user.type(datepicker, "10.10");

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledWith(faktumMockData, null);
        expect(datePickerError).toBeInTheDocument();
      });
    });

    test("Types in 1010 should call saveFaktum, post null to server and show error message", async () => {
      const user = userEvent.setup();

      render(
        <MockContext mockQuizContext={true}>
          <FaktumDato faktum={faktumMockData} />
        </MockContext>,
      );

      const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      await user.type(datepicker, "1010");
      const datePickerError = document.querySelector(
        '*[id^="datepicker-input-error"]',
      ) as HTMLInputElement;

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
        expect(mockSaveFaktumToQuiz).toBeCalledWith(faktumMockData, null);
        expect(datePickerError).toBeInTheDocument();
      });
    });

    describe("When user selects a date for faktum: faktum.dagpenger-soknadsdato", () => {
      test("Selects a date three weeks from now should post selected date to server and display warning message", async () => {
        const faktumSoknadsdatoMockData = {
          ...faktumMockData,
          beskrivendeId: "faktum.dagpenger-soknadsdato",
        };

        const threeWeeksFromNow = addWeeks(new Date(), 3);
        const datePickerFormattedDate = format(threeWeeksFromNow, "dd.MM.yyyy"); // eg: 20.11.2022
        const isoFormattedDate = formatISO(threeWeeksFromNow, { representation: "date" }); // eg 2022-11-20

        const user = userEvent.setup();

        render(
          <MockContext mockQuizContext={true}>
            <FaktumDato faktum={faktumSoknadsdatoMockData} />
          </MockContext>,
        );

        const datepicker = screen.getByLabelText(
          faktumSoknadsdatoMockData.beskrivendeId,
        ) as HTMLInputElement;
        await user.type(datepicker, datePickerFormattedDate);
        const warningMessage = screen.getByTestId("faktum.soknadsdato-varsel");

        await waitFor(() => {
          expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
          expect(mockSaveFaktumToQuiz).toBeCalledWith(faktumSoknadsdatoMockData, isoFormattedDate);
          expect(warningMessage).toBeInTheDocument();
        });
      });

      test("When user clear selected date three weeks from now should removes warning message and post null to server", async () => {
        const threeWeeksFromNow = addWeeks(new Date(), 3);
        const threeWeeksFromNotIsoFormatted = formatISO(threeWeeksFromNow, {
          representation: "date",
        });

        const faktumSoknadsdatoMockData = {
          ...faktumMockData,
          beskrivendeId: "faktum.dagpenger-soknadsdato",
          svar: threeWeeksFromNotIsoFormatted,
        };

        const user = userEvent.setup();

        render(
          <MockContext mockQuizContext={true}>
            <FaktumDato faktum={faktumSoknadsdatoMockData} />
          </MockContext>,
        );

        const warningMessage = screen.getByTestId("faktum.soknadsdato-varsel");

        await waitFor(() => {
          expect(warningMessage).toBeInTheDocument();
        });

        const datepicker = screen.getByLabelText(
          faktumSoknadsdatoMockData.beskrivendeId,
        ) as HTMLInputElement;
        await user.clear(datepicker);

        await waitFor(() => {
          expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
          expect(mockSaveFaktumToQuiz).toBeCalledWith(faktumSoknadsdatoMockData, null);
          expect(warningMessage).not.toBeInTheDocument();
        });
      });

      test("Selects a date four months from now should post null to server and display error message", async () => {
        const faktumSoknadsdatoMockData = {
          ...faktumMockData,
          beskrivendeId: "faktum.dagpenger-soknadsdato",
        };

        const date = addMonths(new Date(), 4);
        const datePickerFormattedDate = format(date, "dd.MM.yyyy");

        const user = userEvent.setup();

        render(
          <MockContext mockQuizContext={true}>
            <FaktumDato faktum={faktumSoknadsdatoMockData} />
          </MockContext>,
        );

        const datepicker = screen.getByLabelText(
          faktumSoknadsdatoMockData.beskrivendeId,
        ) as HTMLInputElement;
        await user.type(datepicker, datePickerFormattedDate);

        const datePickerError = document.querySelector(
          '*[id^="datepicker-input-error"]',
        ) as HTMLInputElement;

        await waitFor(() => {
          expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
          expect(mockSaveFaktumToQuiz).toBeCalledWith(faktumSoknadsdatoMockData, null);
          expect(datePickerError).toBeInTheDocument();
        });
      });

      test("Selects a date seven months before now should post null to server and display error message", async () => {
        const faktumSoknadsdatoMockData = {
          ...faktumMockData,
          beskrivendeId: "faktum.dagpenger-soknadsdato",
        };

        const date = subMonths(new Date(), 7);
        const datePickerFormattedDate = format(date, "dd.MM.yyyy");

        const user = userEvent.setup();

        render(
          <MockContext mockQuizContext={true}>
            <FaktumDato faktum={faktumSoknadsdatoMockData} />
          </MockContext>,
        );

        const datepicker = screen.getByLabelText(
          faktumSoknadsdatoMockData.beskrivendeId,
        ) as HTMLInputElement;
        await user.type(datepicker, datePickerFormattedDate);

        const datePickerError = document.querySelector(
          '*[id^="datepicker-input-error"]',
        ) as HTMLInputElement;

        await waitFor(() => {
          expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
          expect(mockSaveFaktumToQuiz).toBeCalledWith(faktumSoknadsdatoMockData, null);
          expect(datePickerError).toBeInTheDocument();
        });
      });
    });
  });

  describe("When user selects future date on faktum.barn-foedselsdato", () => {
    test("Should show error messaage and not post to server", async () => {
      const faktumBarnFodselsdatoMockData = {
        ...faktumMockData,
        beskrivendeId: "faktum.barn-foedselsdato",
      };

      const user = userEvent.setup();

      const threeWeeksFromNow = addWeeks(new Date(), 3);
      const datePickerFormattedDate = format(threeWeeksFromNow, "dd.MM.yyyy");

      render(
        <MockContext mockQuizContext={true}>
          <FaktumDato faktum={faktumBarnFodselsdatoMockData} />
        </MockContext>,
      );

      const datepicker = screen.getByLabelText(
        faktumBarnFodselsdatoMockData.beskrivendeId,
      ) as HTMLInputElement;
      const datePickerError = document.querySelector(
        '*[id^="datepicker-input-error"]',
      ) as HTMLInputElement;
      await user.type(datepicker, datePickerFormattedDate);

      await waitFor(() => {
        expect(datePickerError).toBeInTheDocument();
        expect(mockSaveFaktumToQuiz).not.toBeCalled();
      });
    });
  });
});
