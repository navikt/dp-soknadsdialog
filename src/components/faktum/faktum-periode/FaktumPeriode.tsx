import { Fieldset, DatePicker, useDatepicker } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { formatISO } from "date-fns";
import { forwardRef, Ref, useEffect, useState } from "react";
import { DATEPICKER_MAX_DATE, DATEPICKER_MIN_DATE } from "../../../constants";
import { useQuiz } from "../../../context/quiz-context";
import { useSanity } from "../../../context/sanity-context";
import { useValidation } from "../../../context/validation-context";
import { useValidateFaktumPeriode } from "../../../hooks/validation/useValidateFaktumPeriode";
import { useDebouncedCallback } from "../../../hooks/useDebouncedCallback";
import { useFirstRender } from "../../../hooks/useFirstRender";
import { IQuizPeriodeFaktum, IQuizPeriodeFaktumAnswerType } from "../../../types/quiz.types";
import { HelpText } from "../../HelpText";
import { IFaktum } from "../Faktum";
import styles from "../Faktum.module.css";
import periodeStyles from "./FaktumPeriode.module.css";
import { AlertText } from "../../alert-text/AlertText";
import { objectsNotEqual } from "../../../utils/arbeidsforhold.utils";
import { DateValidationT } from "@navikt/ds-react/src/date/hooks/useDatepicker";
import { useUserInformation } from "../../../context/user-information-context";

export interface IPeriodeFaktumAnswerState {
  fom: string | null;
  tom?: string | null;
}

export const FaktumPeriode = forwardRef(FaktumPeriodeComponent);

function FaktumPeriodeComponent(
  props: IFaktum<IQuizPeriodeFaktum>,
  ref: Ref<HTMLDivElement> | undefined,
) {
  const { faktum, hideAlertText } = props;
  const isFirstRender = useFirstRender();
  const { saveFaktumToQuiz, isLocked } = useQuiz();
  const { getFaktumTextById, getAppText } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const { contextSelectedArbeidsforhold } = useUserInformation();
  const { validateAndIsValidPeriode, tomErrorMessage, fomErrorMessage, clearErrorMessage } =
    useValidateFaktumPeriode(faktum);

  const initialPeriodeValue = { fom: "" };
  const [currentAnswer, setCurrentAnswer] = useState<
    IQuizPeriodeFaktumAnswerType | IPeriodeFaktumAnswerState
  >(faktum.svar ?? initialPeriodeValue);
  const [debouncedPeriode, setDebouncedPeriode] = useState(currentAnswer);
  const debouncedChange = useDebouncedCallback(setDebouncedPeriode, 500);

  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const faktumTextFra = getAppText(`${faktum.beskrivendeId}.fra`);
  const faktumTextTil = getAppText(`${faktum.beskrivendeId}.til`);

  useEffect(() => {
    if (!isFirstRender && objectsNotEqual(faktum.svar, currentAnswer)) {
      saveFaktum(debouncedPeriode as IQuizPeriodeFaktumAnswerType);
    }
  }, [debouncedPeriode]);

  // Used to reset current answer to what the backend state is if there is a mismatch
  useEffect(() => {
    if (faktum.svar !== currentAnswer && !isFirstRender) {
      setCurrentAnswer(faktum.svar ?? initialPeriodeValue);
    }
  }, [faktum.svar]);

  useEffect(() => {
    if (faktum.svar) {
      const fromDate = new Date(faktum.svar.fom);
      const toDate = faktum.svar.tom ? new Date(faktum.svar.tom) : undefined;
      fromInput.setSelected(fromDate);
      toInput.setSelected(toDate);
    }
  }, [faktum.svar]);

  function updatePeriode(date: Date | undefined, variant: "fom" | "tom") {
    if (date) {
      const parsedDate = formatISO(date, { representation: "date" });
      const newPeriode = { ...currentAnswer, [variant]: parsedDate };
      setCurrentAnswer(newPeriode);
      setDebouncedPeriode(newPeriode);
    }
  }

  function validateInput(validation: DateValidationT, variant: "fom" | "tom") {
    // Empty `to date input` programmatically when user clears `from date input`
    if (validation.isEmpty) {
      if (variant === "fom") {
        fromInput.setSelected(undefined);
      } else {
        toInput.setSelected(undefined);
      }
    }

    // When user types in invalid date format
    if (!validation.isEmpty && validation.isInvalid) {
      // Set fom to null for validation
      const periode = { ...currentAnswer, [variant]: null };
      setCurrentAnswer(periode);
      debouncedChange(periode);
    }
  }

  function saveFaktum(value: IPeriodeFaktumAnswerState) {
    clearErrorMessage();

    if (value.fom === "") {
      saveFaktumToQuiz(faktum, null);
      return;
    }

    const isValidPeriode = validateAndIsValidPeriode(value);
    saveFaktumToQuiz(faktum, isValidPeriode ? (value as IQuizPeriodeFaktumAnswerType) : null);
  }

  const fromInput = useDatepicker({
    defaultSelected: currentAnswer.fom ? new Date(currentAnswer.fom) : undefined,
    onDateChange: (value) => updatePeriode(value, "fom"),
    onValidate: (validation) => validateInput(validation, "fom"),
  });

  const toInput = useDatepicker({
    defaultSelected: currentAnswer.tom ? new Date(currentAnswer.tom) : undefined,
    onDateChange: (value) => updatePeriode(value, "tom"),
    onValidate: (validation) => validateInput(validation, "tom"),
  });

  const { datepickerProps, toInputProps, fromInputProps, setSelected } = useRangeDatepicker({
    defaultSelected: getDefaultSelectedValue(),
    onRangeChange: (value?: IDateRange) => {
      if (!value?.from) {
        setCurrentAnswer(initialPeriodeValue);
        debouncedChange(initialPeriodeValue);
        return;
      }

      if (value?.from) {
        const parsedFromDate = formatISO(value.from, { representation: "date" });
        let period: IQuizPeriodeFaktumAnswerType = { fom: parsedFromDate };

        if (value.to) {
          const parsedToDate = formatISO(value.to, { representation: "date" });
          period = { ...period, tom: parsedToDate };
        }

        setCurrentAnswer(period);
        debouncedChange(period);
      }
    },
    onValidate: (value) => {
      console.log(value);
      // Empty `to date input` programmatically when user clears `from date input`
      if (value.from.isEmpty) {
        setSelected({ from: undefined });
      }

      // When user types in invalid date format on `from date input`
      if (!value.from.isEmpty && value.from.isInvalid) {
        // Set fom to null for validation
        const periode = { ...currentAnswer, fom: null };
        setCurrentAnswer(periode);
        debouncedChange(periode);
      }

      // When user types in invalid `to date input`
      if (!value.to.isEmpty && value.to.isInvalid) {
        // Set tom to null for validation
        const periode = { ...currentAnswer, tom: null };
        setCurrentAnswer(periode);
        debouncedChange(periode);
      }
    },
  });

  function saveFaktum(value: IPeriodeFaktumAnswerState) {
    clearErrorMessage();

    if (value.fom === "") {
      saveFaktumToQuiz(faktum, null);
      return;
    }

    const faktumArbeidsforholdVarighet = faktum.beskrivendeId === "faktum.arbeidsforhold.varighet";
    if (faktumArbeidsforholdVarighet && contextSelectedArbeidsforhold) {
      if (value.fom !== contextSelectedArbeidsforhold.startdato) {
        trackKorrigertStartdatoFraAAREG("dagpenger");
      }

      if (value?.tom !== contextSelectedArbeidsforhold.sluttdato) {
        trackKorrigertSluttdatoFraAAREG("dagpenger");
      }
    }

    const isValidPeriode = validateAndIsValidPeriode(value);
    saveFaktumToQuiz(faktum, isValidPeriode ? (value as IQuizPeriodeFaktumAnswerType) : null);
  }

  return (
    <div
      className={periodeStyles.faktumPeriode}
      ref={ref}
      tabIndex={-1}
      aria-invalid={unansweredFaktumId === faktum.id}
    >
      <Fieldset legend={faktumTexts ? faktumTexts.text : faktum.beskrivendeId}>
        {faktumTexts?.description && (
          <div className={periodeStyles.faktumPeriodeDescription}>
            <PortableText value={faktumTexts.description} />
          </div>
        )}

        <DatePicker
          {...fromInput.datepickerProps}
          fromDate={DATEPICKER_MIN_DATE}
          toDate={currentAnswer.tom ? new Date(currentAnswer.tom) : DATEPICKER_MAX_DATE}
          dropdownCaption
          strategy="fixed"
        >
          <DatePicker.Input
            {...fromInput.inputProps}
            label={faktumTextFra}
            placeholder={getAppText("datovelger.dato-format")}
            error={fomErrorMessage}
            disabled={isLocked}
            autoComplete="off"
          />
        </DatePicker>

        <DatePicker
          {...toInput.datepickerProps}
          fromDate={currentAnswer.fom ? new Date(currentAnswer.fom) : DATEPICKER_MIN_DATE}
          toDate={DATEPICKER_MAX_DATE}
          dropdownCaption
          strategy="fixed"
        >
          <DatePicker.Input
            {...toInput.inputProps}
            label={faktumTextTil}
            placeholder={getAppText("datovelger.dato-format")}
            error={tomErrorMessage}
            disabled={isLocked}
            autoComplete="off"
          />
        </DatePicker>

        {faktumTexts?.helpText && (
          <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
        )}

        {faktumTexts?.alertText && !hideAlertText && (
          <AlertText alertText={faktumTexts.alertText} spacingTop />
        )}
      </Fieldset>
    </div>
  );
}
