import {
  BodyShort,
  Fieldset,
  Label,
  UNSAFE_DatePicker,
  UNSAFE_useRangeDatepicker,
} from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { formatISO } from "date-fns";
import { forwardRef, Ref, useEffect, useState } from "react";
import { DATEPICKER_MAX_DATE, DATEPICKER_MIN_DATE } from "../../constants";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { useValidateFaktumPeriode } from "../../hooks/faktum/useValidateFaktumPeriode";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";
import { useFirstRender } from "../../hooks/useFirstRender";
import { IQuizPeriodeFaktum, IQuizPeriodeFaktumAnswerType } from "../../types/quiz.types";
import { FormattedDate } from "../FormattedDate";
import { HelpText } from "../HelpText";
import { IFaktum } from "./Faktum";
import styles from "./Faktum.module.css";
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
  const { saveFaktumToQuiz } = useQuiz();
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

  const beskrivendeIdFra = `${faktum.beskrivendeId}.fra`;
  const beskrivendeIdTil = `${faktum.beskrivendeId}.til`;

  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const faktumTextFra = getAppText(beskrivendeIdFra);
  const faktumTextTil = getAppText(beskrivendeIdTil);

  useEffect(() => {
    if (!isFirstRender) {
      onChange ? onChange(faktum, debouncedPeriode) : saveFaktum(debouncedPeriode);
    }
  }, [debouncedPeriode]);

  useEffect(() => {
    if (faktum.svar === undefined && !isFirstRender) {
      setCurrentAnswer(undefined);
    }
  }, [faktum.svar]);

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

  if (faktum.readOnly || props.readonly) {
    return (
      <div className={periodeStyles.faktumPeriode}>
        <Label className={periodeStyles.readOnlyTittel}>
          {faktumTexts ? faktumTexts.text : faktum.beskrivendeId}
        </Label>
        {currentAnswer?.fom && (
          <div className={periodeStyles.faktumPeriodeFra}>
            <Label>{faktumTextFra}</Label>
            <BodyShort>
              <FormattedDate date={currentAnswer?.fom} />
            </BodyShort>
          </div>
        )}
        {currentAnswer?.tom && (
          <div>
            <Label>{faktumTextTil}</Label>
            <BodyShort>
              <FormattedDate date={currentAnswer?.tom} />
            </BodyShort>
          </div>
        )}
      </div>
    );
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
        {faktumTexts?.helpText && (
          <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
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
            />
            <UNSAFE_DatePicker.Input
              {...toInputProps}
              label={faktumTextTil}
              placeholder={getAppText("datovelger.dato-format")}
              error={tomDateIsBeforeFomDate ? getTomIsBeforeTomErrorMessage() : tomErrorMessage}
            />
          </div>
        </UNSAFE_DatePicker>
      </Fieldset>
    </div>
  );
}
