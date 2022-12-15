import {
  BodyShort,
  Fieldset,
  Label,
  UNSAFE_DatePicker,
  UNSAFE_useRangeDatepicker,
} from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { formatISO } from "date-fns";
import { useEffect, useState } from "react";
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

export function FaktumPeriode(props: IFaktum<IQuizPeriodeFaktum>) {
  const { faktum, onChange } = props;
  const isFirstRender = useFirstRender();
  const { saveFaktumToQuiz } = useQuiz();
  const { getFaktumTextById, getAppText } = useSanity();
  const { setDatePickerIsOpen } = useValidation();
  const [toDateIsBeforeFromDate, setToDateIsBeforeFromDate] = useState(false);
  const { isValid, getTomErrorMessage, getFomErrorMessage } = useValidateFaktumPeriode(faktum);
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
    if (!isFirstRender && debouncedPeriode !== faktum.svar) {
      onChange ? onChange(faktum, debouncedPeriode) : saveFaktum(debouncedPeriode);
    }
  }, [debouncedPeriode]);

  useEffect(() => {
    if (faktum.svar === undefined && !isFirstRender) {
      setCurrentAnswer(undefined);
    }
  }, [faktum.svar]);

  function getInitialRangeDateValue(): IDateRange | undefined {
    if (currentAnswer?.fom) {
      return {
        from: new Date(currentAnswer.fom),
        to: currentAnswer.tom ? new Date(currentAnswer.tom) : undefined,
      };
    }

    return undefined;
  }

  const { datepickerProps, toInputProps, fromInputProps } = UNSAFE_useRangeDatepicker({
    defaultSelected: getInitialRangeDateValue(),
    onRangeChange: (value?: IDateRange) => handleDateChange(value),
    onValidate: (value) => {
      if (value.to) {
        setToDateIsBeforeFromDate(!!value.to?.isBeforeFrom);
      }
    },
  });

  // Use to prevent Escape key press to close both datepicker and modal simultaneously
  useEffect(() => {
    setDatePickerIsOpen(!!datepickerProps.open);
  }, [datepickerProps]);

  function handleDateChange(value?: IDateRange) {
    if (!value?.from) {
      setCurrentAnswer(undefined);
      debouncedChange(null);
    }

    if (value?.from) {
      if (!value.to) {
        const parsedFromDate = formatISO(value.from, { representation: "date" });
        const period = { fom: parsedFromDate };

        setCurrentAnswer(period);
        debouncedChange(period);
      }

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

    if (!toDateIsBeforeFromDate && value && isValid(value)) {
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
    <div className={periodeStyles.faktumPeriode}>
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
              error={getFomErrorMessage()}
            />
            <UNSAFE_DatePicker.Input
              {...toInputProps}
              label={faktumTextTil}
              placeholder={getAppText("datovelger.dato-format")}
              error={
                toDateIsBeforeFromDate
                  ? getAppText("validering.arbeidsforhold.varighet-til")
                  : getTomErrorMessage()
              }
            />
          </div>
        </UNSAFE_DatePicker>
      </Fieldset>
    </div>
  );
}
