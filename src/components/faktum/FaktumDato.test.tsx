import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { addWeeks, addYears, format, formatISO } from "date-fns";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../types/quiz.types";
import { MockContext } from "../../__mocks__/MockContext";
import { FaktumDato } from "./FaktumDato";

const faktumMockData: QuizFaktum | IQuizGeneratorFaktum = {
  id: "8001",
  type: "localdate",
  readOnly: false,
  beskrivendeId: "faktum.dagpenger-soknadsdato",
  sannsynliggjoresAv: [],
};

describe("FaktumDato", () => {
  // Undo any answer after each test
  beforeEach(() => (faktumMockData.svar = undefined));

  test("Should show faktum question and datepicker", async () => {
    render(
      <MockContext>
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
    faktumMockData.svar = "2022-08-04";

    render(
      <MockContext>
        <FaktumDato faktum={faktumMockData} />
      </MockContext>
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
        <MockContext>
          <FaktumDato faktum={faktumMockData} onChange={onchange} />
        </MockContext>
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
        <MockContext>
          <FaktumDato faktum={faktumMockData} onChange={onchange} />
        </MockContext>
      );

      const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      await user.clear(datepicker);

      await waitFor(() => {
        expect(onchange).toBeCalledTimes(1);
        expect(onchange).toBeCalledWith(faktumMockData, null);
      });
    });
  });

  describe("When user selects a date three weeks from now", () => {
    test("Should post selected date to server and display warning message", async () => {
      const threeWeeksFromNow = addWeeks(new Date(), 3);
      const datePickerFormattedDate = format(threeWeeksFromNow, "dd.MM.yyyy"); // eg: 20.11.2022
      const isoFormattedDate = formatISO(threeWeeksFromNow, { representation: "date" }); // eg 2022-11-20

      const user = userEvent.setup();
      const onchange = jest.fn();

      render(
        <MockContext>
          <FaktumDato faktum={faktumMockData} onChange={onchange} />
        </MockContext>
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

  describe("When user selects a date over 100 years from now", () => {
    test("Should show error message", async () => {
      const twoHundretYearsFromNow = addYears(new Date(), 200);
      const datePickerFormattedDate = format(twoHundretYearsFromNow, "dd.MM.yyyy");

      const user = userEvent.setup();
      const onchange = jest.fn();

      render(
        <MockContext>
          <FaktumDato faktum={faktumMockData} onChange={onchange} />
        </MockContext>
      );

      const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      await user.type(datepicker, datePickerFormattedDate);
      const datePickerError = document.querySelector(
        ".navds-form-field__error"
      ) as HTMLInputElement;
      await user.type(datepicker, datePickerFormattedDate);

      await waitFor(() => {
        expect(datePickerError).toBeInTheDocument();
      });
    });
  });

  describe("When user types in 10102022 on datepicker", () => {
    test("Should post 2022-10-10 to server", async () => {
      const user = userEvent.setup();
      const onchange = jest.fn();

      render(
        <MockContext>
          <FaktumDato faktum={faktumMockData} onChange={onchange} />
        </MockContext>
      );

      const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      await user.type(datepicker, "10102022");

      await waitFor(() => {
        expect(onchange).toBeCalledTimes(1);
        expect(onchange).toBeCalledWith(faktumMockData, "2022-10-10");
      });
    });
  });

  describe("When user removes a date three weeks from now", () => {
    test("Should save null to server and removes warning message", async () => {
      const threeWeeksFromNow = addWeeks(new Date(), 3);
      const threeWeeksFromNotIsoFormatted = formatISO(threeWeeksFromNow, {
        representation: "date",
      });

      faktumMockData.svar = threeWeeksFromNotIsoFormatted;

      const user = userEvent.setup();
      const onchange = jest.fn();

      render(
        <MockContext>
          <FaktumDato faktum={faktumMockData} onChange={onchange} />
        </MockContext>
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

  describe("When user a types in date before 01.01.1900: eg 01.01.1800", () => {
    test("Should show error message", async () => {
      const seletedDate = format(new Date("01.01.1800"), "dd.MM.yyyy");

      const user = userEvent.setup();
      const onchange = jest.fn();

      render(
        <MockContext>
          <FaktumDato faktum={faktumMockData} onChange={onchange} />
        </MockContext>
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

  describe("When user types in different invalid date", () => {
    test("Types in 10.10.10 should post null to server and show error message", async () => {
      const user = userEvent.setup();
      const onchange = jest.fn();

      render(
        <MockContext>
          <FaktumDato faktum={faktumMockData} onChange={onchange} />
        </MockContext>
      );

      const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      const datePickerError = document.querySelector(
        ".navds-form-field__error"
      ) as HTMLInputElement;
      await user.type(datepicker, "10.10.10");

      await waitFor(() => {
        expect(onchange).toBeCalledTimes(1);
        expect(onchange).toBeCalledWith(faktumMockData, null);
        expect(datePickerError).toBeInTheDocument();
      });
    });

    test("Types in 101010 should post null to server and show error message", async () => {
      const user = userEvent.setup();
      const onchange = jest.fn();

      render(
        <MockContext>
          <FaktumDato faktum={faktumMockData} onChange={onchange} />
        </MockContext>
      );

      const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      await user.type(datepicker, "101010");
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

  describe("When user selects future date on faktum.barn-foedselsdato", () => {
    test("Selecting future date on faktum.barn-fodeseldato should show error messaage", async () => {
      faktumMockData.beskrivendeId = "faktum.barn-foedselsdato";

      const user = userEvent.setup();
      const onchange = jest.fn();

      const threeWeeksFromNow = addWeeks(new Date(), 3);
      const datePickerFormattedDate = format(threeWeeksFromNow, "dd.MM.yyyy");

      render(
        <MockContext>
          <FaktumDato faktum={faktumMockData} onChange={onchange} />
        </MockContext>
      );

      const datepicker = screen.getByLabelText(faktumMockData.beskrivendeId) as HTMLInputElement;
      const datePickerError = document.querySelector(
        ".navds-form-field__error"
      ) as HTMLInputElement;
      await user.type(datepicker, datePickerFormattedDate);

      await waitFor(() => {
        expect(datePickerError).toBeInTheDocument();
      });
    });
  });
});
