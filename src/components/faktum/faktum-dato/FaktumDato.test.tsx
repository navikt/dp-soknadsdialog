import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  format,
  formatISO,
  subDays,
  subMonths,
  subYears,
} from "date-fns";
import { MockContext } from "../../../__mocks__/MockContext";
import { mockSaveFaktumToQuiz } from "../../../__mocks__/MockSoknadProvider";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../../types/quiz.types";
import { MockContext } from "../../../__mocks__/MockContext";
import { FaktumDato } from "./FaktumDato";
import { mockSaveFaktumToQuiz } from "../../../__mocks__/MockSoknadProvider";

const mockFaktumSoknadsdato: QuizFaktum | IQuizGeneratorFaktum = {
  id: "8001",
  type: "localdate",
  readOnly: false,
  beskrivendeId: "faktum.dagpenger-soknadsdato",
  sannsynliggjoresAv: [],
};

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  id: "8001",
  type: "localdate",
  readOnly: false,
  beskrivendeId: "faktum.arbeidsforhold.kontraktfestet-sluttdato",
  sannsynliggjoresAv: [],
};

describe("FaktumDato", () => {
  // Undo any answer after each test
  beforeEach(() => (mockFaktumSoknadsdato.svar = undefined));

  test("Should show faktum question and datepicker", async () => {
    render(
      <MockContext>
        <FaktumDato faktum={mockFaktumSoknadsdato} />
      </MockContext>,
    );

    const datepicker = screen.getByLabelText(mockFaktumSoknadsdato.beskrivendeId);

    await waitFor(() => {
      expect(screen.queryByText(mockFaktumSoknadsdato.beskrivendeId)).toBeInTheDocument();
      expect(datepicker).toBeInTheDocument();
    });
  });

  test("Should show preselected faktum answer if it's already selected", async () => {
    mockFaktumSoknadsdato.svar = "2022-08-04";

    render(
      <MockContext>
        <FaktumDato faktum={mockFaktumSoknadsdato} />
      </MockContext>,
    );

    // Casting it to access the value attribute
    const datepicker = screen.getByLabelText(
      mockFaktumSoknadsdato.beskrivendeId,
    ) as HTMLInputElement;

    await waitFor(() => {
      expect(datepicker.value).toBe("04.08.2022");
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
      await user.tab();

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
        expect(mockSaveFaktumToQuiz).toBeCalledWith(faktumMockData, null);
      });
    });
  });

  describe("When selected date is not within 01.01.1900 and 100 year from now", () => {
    test("Selecting a date two hundret years from now should show error message and not post null server", async () => {
      const twoHundredYearsFromNow = addYears(new Date(), 201);
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
      });

      await user.tab();

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledWith(faktumMockData, null);
      });
    });

    test("Selecting a date two hundret years in the past should show error message and post null to server", async () => {
      const twoHundredYearsFromNow = subYears(new Date(), -201);
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
      });

      await user.tab();

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledWith(faktumMockData, null);
      });
    });
  });

  describe("When user types in different invalid date formats an leaves input field. Valid format is DDMMYYY, DD.MM.YYYY, DDMMYY or DD.MM.YY", () => {
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
        expect(datePickerError).toBeInTheDocument();
      });

      await user.tab();

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledWith(faktumMockData, null);
      });
    });

    test("Types in 1010 and leaves input should call saveFaktum, post null to server and show error message", async () => {
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
        expect(datePickerError).toBeInTheDocument();
      });

      await user.tab();

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledWith(faktumMockData, null);
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

  describe("BeskrivendeId: faktum.dagpenger-soknadsdato", () => {
    test("Should post the answer to the server when user selects a valid date", async () => {
      const user = userEvent.setup();

      render(
        <MockContext mockQuizContext={true}>
          <FaktumDato faktum={mockFaktumSoknadsdato} />
        </MockContext>,
      );

      const datepicker = screen.getByLabelText(
        mockFaktumSoknadsdato.beskrivendeId,
      ) as HTMLInputElement;

      const date = format(new Date(), "dd.MM.yyyy");
      await user.type(datepicker, date);
      const isoFormattedDate = formatISO(new Date(), { representation: "date" });

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
        expect(mockSaveFaktumToQuiz).toBeCalledWith(mockFaktumSoknadsdato, isoFormattedDate);
      });
    });

    test("Should post null to the server when user clear selected date", async () => {
      const user = userEvent.setup();
      const mockFaktumSoknadsdatoWithSvar = { ...mockFaktumSoknadsdato, svar: "2022-08-04" };

      render(
        <MockContext mockQuizContext={true}>
          <FaktumDato faktum={mockFaktumSoknadsdatoWithSvar} />
        </MockContext>,
      );

      const datepicker = screen.getByLabelText(
        mockFaktumSoknadsdatoWithSvar.beskrivendeId,
      ) as HTMLInputElement;

      await user.clear(datepicker);
      await user.tab();

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
        expect(mockSaveFaktumToQuiz).toBeCalledWith(mockFaktumSoknadsdatoWithSvar, null);
      });
    });

    test("Should not post anything to the server when the user tries to clear a date that is already empty", async () => {
      const user = userEvent.setup();

      render(
        <MockContext mockQuizContext={true}>
          <FaktumDato faktum={mockFaktumSoknadsdato} />
        </MockContext>,
      );

      const datepicker = screen.getByLabelText(
        mockFaktumSoknadsdato.beskrivendeId,
      ) as HTMLInputElement;

      await user.clear(datepicker);

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).not.toBeCalled();
      });
    });

    test("Should not post the server when types invalid date", async () => {
      const user = userEvent.setup();

      render(
        <MockContext mockQuizContext={true}>
          <FaktumDato faktum={mockFaktumSoknadsdato} />
        </MockContext>,
      );

      const datepicker = screen.getByLabelText(
        mockFaktumSoknadsdato.beskrivendeId,
      ) as HTMLInputElement;

      await user.type(datepicker, "xyz");

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).not.toBeCalled();
      });
    });

    test("Should show warning message when søknadsdato is over two weeks from now", async () => {
      const user = userEvent.setup();

      render(
        <MockContext mockQuizContext={true}>
          <FaktumDato faktum={mockFaktumSoknadsdato} />
        </MockContext>,
      );

      const datepicker = screen.getByLabelText(
        mockFaktumSoknadsdato.beskrivendeId,
      ) as HTMLInputElement;

      const date = addDays(new Date(), 15);
      const formattedDate = format(date, "dd.MM.yyyy");
      await user.type(datepicker, formattedDate);
      const isoFormattedDate = formatISO(date, { representation: "date" });
      const warningMessage = screen.getByTestId("faktum.soknadsdato-varsel");

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
        expect(mockSaveFaktumToQuiz).toBeCalledWith(mockFaktumSoknadsdato, isoFormattedDate);
        expect(warningMessage).toBeInTheDocument();
      });
    });

    test("Should show error message if the user enters a “søknadsdato” more than six months in the past.", async () => {
      const user = userEvent.setup();

      render(
        <MockContext mockQuizContext={true}>
          <FaktumDato faktum={mockFaktumSoknadsdato} />
        </MockContext>,
      );

      const datepicker = screen.getByLabelText(
        mockFaktumSoknadsdato.beskrivendeId,
      ) as HTMLInputElement;

      const date = subMonths(new Date(), 6);
      const formattedDate = format(subDays(date, 1), "dd.MM.yyyy");
      await user.type(datepicker, formattedDate);
      const datePickerError = document.querySelector(
        '*[id^="datepicker-input-error"]',
      ) as HTMLInputElement;

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).not.toBeCalled();
        expect(datePickerError).toBeInTheDocument();
      });
    });

    test("Should show error message if the user enters a “søknadsdato” more than three months in the future.", async () => {
      const user = userEvent.setup();

      render(
        <MockContext mockQuizContext={true}>
          <FaktumDato faktum={mockFaktumSoknadsdato} />
        </MockContext>,
      );

      const datepicker = screen.getByLabelText(
        mockFaktumSoknadsdato.beskrivendeId,
      ) as HTMLInputElement;

      const date = addMonths(new Date(), 3);
      const formattedDate = format(addDays(date, 1), "dd.MM.yyyy");
      await user.type(datepicker, formattedDate);
      const datePickerError = document.querySelector(
        '*[id^="datepicker-input-error"]',
      ) as HTMLInputElement;

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).not.toBeCalled();
        expect(datePickerError).toBeInTheDocument();
      });
    });

    test("Should remove warning if user types invalid date", async () => {
      const user = userEvent.setup();
      const threeWeeksFromNow = format(addWeeks(new Date(), 3), "yyyy-MM-dd");
      const mockFaktumSoknadsdatoWithFutureDate = {
        ...mockFaktumSoknadsdato,
        svar: threeWeeksFromNow,
      };

      render(
        <MockContext mockQuizContext={true}>
          <FaktumDato faktum={mockFaktumSoknadsdatoWithFutureDate} />
        </MockContext>,
      );

      const warningMessage = screen.getByTestId("faktum.soknadsdato-varsel");

      await waitFor(() => {
        expect(warningMessage).toBeInTheDocument();
      });

      const datepicker = screen.getByLabelText(
        mockFaktumSoknadsdatoWithFutureDate.beskrivendeId,
      ) as HTMLInputElement;

      await user.type(datepicker, "xyz");
      const datePickerError = document.querySelector(
        '*[id^="datepicker-input-error"]',
      ) as HTMLInputElement;

      await waitFor(() => {
        expect(datePickerError).toBeInTheDocument();
        expect(warningMessage).not.toBeInTheDocument();
      });
    });

    test("Should save a valid date to the server, display an error message if the user enters an invalid date immediately afterward, and should not call to the server", async () => {
      const user = userEvent.setup();
      const mockFaktumSoknadsdatoWithSvar = {
        ...mockFaktumSoknadsdato,
        svar: format(new Date(), "yyyy-MM-dd"),
      };

      render(
        <MockContext mockQuizContext={true}>
          <FaktumDato faktum={mockFaktumSoknadsdatoWithSvar} />
        </MockContext>,
      );

      const datepicker = screen.getByLabelText(
        mockFaktumSoknadsdatoWithSvar.beskrivendeId,
      ) as HTMLInputElement;

      await user.type(datepicker, "xyz");
      const datePickerError = document.querySelector(
        '*[id^="datepicker-input-error"]',
      ) as HTMLInputElement;

      await waitFor(() => {
        expect(datePickerError).toBeInTheDocument();
        expect(mockSaveFaktumToQuiz).not.toBeCalled();
      });
    });

    test("Should save null to the server if the user enters an invalid date after a valid date and then leaves the input field", async () => {
      const user = userEvent.setup();
      const mockFaktumSoknadsdatoWithSvar = {
        ...mockFaktumSoknadsdato,
        svar: format(new Date(), "yyyy-MM-dd"),
      };

      render(
        <MockContext mockQuizContext={true}>
          <FaktumDato faktum={mockFaktumSoknadsdatoWithSvar} />
        </MockContext>,
      );

      const datepicker = screen.getByLabelText(
        mockFaktumSoknadsdatoWithSvar.beskrivendeId,
      ) as HTMLInputElement;

      await user.type(datepicker, "xyz");
      const datePickerError = document.querySelector(
        '*[id^="datepicker-input-error"]',
      ) as HTMLInputElement;

      await waitFor(() => {
        expect(datePickerError).toBeInTheDocument();
        expect(mockSaveFaktumToQuiz).not.toBeCalled();
      });

      await user.tab();

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
        expect(mockSaveFaktumToQuiz).toBeCalledWith(mockFaktumSoknadsdatoWithSvar, null);
      });
    });

    test("Should post yyyy-MM-dd to server because ddMMyyy is also a valid format", async () => {
      const user = userEvent.setup();

      render(
        <MockContext mockQuizContext={true}>
          <FaktumDato faktum={mockFaktumSoknadsdato} />
        </MockContext>,
      );

      const datepicker = screen.getByLabelText(
        mockFaktumSoknadsdato.beskrivendeId,
      ) as HTMLInputElement;

      const date = format(new Date(), "ddMMyyyy");

      const isoFormattedDate = formatISO(new Date(), { representation: "date" });
      await user.type(datepicker, date);

      await waitFor(() => {
        expect(mockSaveFaktumToQuiz).toBeCalledTimes(1);
        expect(mockSaveFaktumToQuiz).toBeCalledWith(mockFaktumSoknadsdato, isoFormattedDate);
      });
    });
  });
});
