import { Fieldset, UNSAFE_DatePicker, UNSAFE_useRangeDatepicker } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { formatISO } from "date-fns";
import { forwardRef, Ref, useEffect, useState } from "react";
import { DATEPICKER_MAX_DATE, DATEPICKER_MIN_DATE } from "../../../constants";
import { useQuiz } from "../../../context/quiz-context";
import { useSanity } from "../../../context/sanity-context";
import { useValidation } from "../../../context/validation-context";
import { useValidateFaktumPeriode } from "../../../hooks/faktum/useValidateFaktumPeriode";
import { useDebouncedCallback } from "../../../hooks/useDebouncedCallback";
import { useFirstRender } from "../../../hooks/useFirstRender";
import { IQuizPeriodeFaktum, IQuizPeriodeFaktumAnswerType } from "../../../types/quiz.types";
import { HelpText } from "../../HelpText";
import { IFaktum } from "../Faktum";
import styles from "../Faktum.module.css";
import periodeStyles from "./FaktumPeriode.module.css";

interface IDateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

export const FaktumPeriode = forwardRef(FaktumPeriodeComponent);

function FaktumPeriodeComponent(
  props: IFaktum<IQuizPeriodeFaktum>,
  ref: Ref<HTMLDivElement> | undefined
) {
  const { faktum, onChange } = props;
  const isFirstRender = useFirstRender();
  const { saveFaktumToQuiz, isLocked } = useQuiz();
  const { getFaktumTextById, getAppText } = useSanity();
  const { setDatePickerIsOpen, unansweredFaktumId } = useValidation();
  const [tomDateIsBeforeFomDate, setTomDateIsBeforeFomDate] = useState(false);
  const { isValid, tomErrorMessage, fomErrorMessage, getTomIsBeforeTomErrorMessage } =
    useValidateFaktumPeriode(faktum);
  const [currentAnswer, setCurrentAnswer] = useState<
    IQuizPeriodeFaktumAnswerType | undefined | null
  >(faktum.svar);
  const [debouncedPeriode, setDebouncedPeriode] = useState(currentAnswer);
  const debouncedChange = useDebouncedCallback(setDebouncedPeriode, 500);

  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const faktumTextFra = getAppText(`${faktum.beskrivendeId}.fra`);
  const faktumTextTil = getAppText(`${faktum.beskrivendeId}.til`);

  useEffect(() => {
    if (!isFirstRender) {
      onChange ? onChange(faktum, debouncedPeriode) : saveFaktum(debouncedPeriode);
    }
  }, [debouncedPeriode]);

  useEffect(() => {
    if (!isFirstRender && faktum.svar !== currentAnswer) {
      setCurrentAnswer(faktum.svar ? faktum.svar : null);
    }
  }, [faktum]);

  function getDefaultSelectedValue(): IDateRange | undefined {
    if (currentAnswer?.fom) {
      return {
        from: new Date(currentAnswer.fom),
        to: currentAnswer.tom ? new Date(currentAnswer.tom) : undefined,
      };
    }

    return undefined;
  }

  const { datepickerProps, toInputProps, fromInputProps, setSelected } = UNSAFE_useRangeDatepicker({
    defaultSelected: getDefaultSelectedValue(),
    onRangeChange: (value?: IDateRange) => handleDateChange(value),
    onValidate: (value) => {
      if (value.to) {
        setTomDateIsBeforeFomDate(!!value.to?.isBeforeFrom);
      }
    },
  });

  // Use to prevent Escape key press to close both datepicker and modal simultaneously
  // This is a temporaty fix for ds-react version 2.0.9
  // Design system team are working on a better solution
  useEffect(() => {
    setDatePickerIsOpen(!!datepickerProps.open);
  }, [datepickerProps]);

  function handleDateChange(value?: IDateRange) {
    // When user clears from date from answered period, should automatically clear to date
    if (!value?.from && value?.to) {
      // Clear to date when from date is empty programmatically
      setSelected({ from: undefined });
      setCurrentAnswer(null);
      debouncedChange(null);
    }

    // When user clears from date from answered period without to date
    if (!value?.from && !value?.to) {
      setCurrentAnswer(null);
      debouncedChange(null);
    }

    if (value?.from) {
      // When to date is not speficied or to date is before from date
      if (!value.to || tomDateIsBeforeFomDate) {
        const parsedFromDate = formatISO(value.from, { representation: "date" });
        const period = { fom: parsedFromDate };

        setCurrentAnswer(period);
        debouncedChange(period);
      }

      // When both from and to date is provided
      if (value.to) {
        const parsedFromDate = formatISO(value.from, { representation: "date" });
        const parsedToDate = formatISO(value.to, { representation: "date" });
        const period = { fom: parsedFromDate, tom: parsedToDate };
        setCurrentAnswer(period);
        debouncedChange(period);
      }
    }
  }

  function saveFaktum(value: IQuizPeriodeFaktumAnswerType | null | undefined) {
    if (!value) {
      saveFaktumToQuiz(faktum, null);
    }

    if (value && !isValid(value)) {
      saveFaktumToQuiz(faktum, null);
    }

    if (value && isValid(value)) {
      saveFaktumToQuiz(faktum, value);
    }
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

        <UNSAFE_DatePicker
          {...datepickerProps}
          dropdownCaption
          fromDate={DATEPICKER_MIN_DATE}
          toDate={DATEPICKER_MAX_DATE}
          strategy="fixed"
        >
          <div className={periodeStyles.datePickerSpacing}>
            <UNSAFE_DatePicker.Input
              {...fromInputProps}
              label={faktumTextFra}
              placeholder={getAppText("datovelger.dato-format")}
              error={fomErrorMessage}
              disabled={isLocked}
            />

            <UNSAFE_DatePicker.Input
              {...toInputProps}
              label={faktumTextTil}
              placeholder={getAppText("datovelger.dato-format")}
              error={tomDateIsBeforeFomDate ? getTomIsBeforeTomErrorMessage() : tomErrorMessage}
              disabled={isLocked}
            />
          </div>
        </UNSAFE_DatePicker>

        {faktumTexts?.helpText && (
          <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
        )}
      </Fieldset>
    </div>
  );
}
