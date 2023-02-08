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
  const { faktum } = props;
  const isFirstRender = useFirstRender();
  const { saveFaktumToQuiz } = useQuiz();
  const { getFaktumTextById, getAppText } = useSanity();
  const { setDatePickerIsOpen, unansweredFaktumId } = useValidation();
  const { validateAndIsValidPeriode, tomErrorMessage, fomErrorMessage, clearErrorMessage } =
    useValidateFaktumPeriode(faktum);

  const initialPeriodeValue = { fom: "" };
  const [currentAnswer, setCurrentAnswer] = useState<IQuizPeriodeFaktumAnswerType>(
    faktum.svar ?? initialPeriodeValue
  );
  const [debouncedPeriode, setDebouncedPeriode] = useState(currentAnswer);
  const debouncedChange = useDebouncedCallback(setDebouncedPeriode, 500);

  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const faktumTextFra = getAppText(`${faktum.beskrivendeId}.fra`);
  const faktumTextTil = getAppText(`${faktum.beskrivendeId}.til`);

  useEffect(() => {
    if (!isFirstRender) {
      saveFaktum(debouncedPeriode);
    }
  }, [debouncedPeriode]);

  useEffect(() => {
    if (!faktum.svar && !isFirstRender) {
      setCurrentAnswer(initialPeriodeValue);
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
      if (value.from.isEmpty) {
        setSelected({ from: undefined });
        setCurrentAnswer(initialPeriodeValue);
        debouncedChange(initialPeriodeValue);
        return;
      }

      if (!value.from.isEmpty && value.from.isInvalid) {
        const periode = { ...currentAnswer, fom: null };
        setCurrentAnswer(periode);
        debouncedChange(periode);
        return;
      }

      if (value.to.isEmpty && value.to.isInvalid) {
        const periode = { fom: currentAnswer.fom };
        setCurrentAnswer(periode);
        debouncedChange(periode);
        return;
      }

      if (!value.to.isEmpty && value.to.isInvalid) {
        const periode = { ...currentAnswer, tom: null };
        setCurrentAnswer(periode);
        debouncedChange(periode);
        return;
      }
    },
  });

  // Use to prevent Escape key press to close both datepicker and modal simultaneously
  // This is a temporaty fix for ds-react from version 2.0.9
  // Design system team are working on a better solution
  useEffect(() => {
    setDatePickerIsOpen(!!datepickerProps.open);
  }, [datepickerProps]);

  function saveFaktum(value: IQuizPeriodeFaktumAnswerType) {
    clearErrorMessage();

    if (value.fom === "") {
      saveFaktumToQuiz(faktum, null);
      return;
    }

    const isValidPeriode = validateAndIsValidPeriode(value);
    saveFaktumToQuiz(faktum, isValidPeriode ? value : null);
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
            />

            <UNSAFE_DatePicker.Input
              {...toInputProps}
              label={faktumTextTil}
              placeholder={getAppText("datovelger.dato-format")}
              error={tomErrorMessage}
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
