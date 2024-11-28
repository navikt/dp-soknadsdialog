import { DatePicker, Fieldset, useDatepicker } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { formatISO, isBefore } from "date-fns";
import { forwardRef, Ref, useEffect, useState } from "react";
import { DATEPICKER_FROM_DATE, DATEPICKER_TO_DATE } from "../../../constants";
import { useSanity } from "../../../context/sanity-context";
import { useSoknad } from "../../../context/soknad-context";
import { useValidation } from "../../../context/validation-context";
import { useValidateFaktumPeriode } from "../../../hooks/validation/useValidateFaktumPeriode";
import { IQuizPeriodeFaktum, IQuizPeriodeFaktumAnswerType } from "../../../types/quiz.types";
import { AlertText } from "../../alert-text/AlertText";
import { HelpText } from "../../HelpText";
import { IFaktum } from "../Faktum";
import styles from "../Faktum.module.css";
import periodeStyles from "./FaktumPeriode.module.css";
import { useFirstRender } from "../../../hooks/useFirstRender";

export interface IPeriodeFaktumSvar {
  fom: string | null;
  tom?: string | null;
}

export const FaktumPeriode = forwardRef(FaktumPeriodeComponent);

function FaktumPeriodeComponent(
  props: IFaktum<IQuizPeriodeFaktum>,
  ref: Ref<HTMLDivElement> | undefined,
) {
  const { faktum, hideAlertText } = props;
  const { saveFaktumToQuiz, isLocked } = useSoknad();
  const { getFaktumTextById, getAppText } = useSanity();
  const isFirstRender = useFirstRender();
  const { unansweredFaktumId } = useValidation();
  const { validateAndIsValidPeriode, toError, fromError, setFromError, setToError } =
    useValidateFaktumPeriode(faktum);

  const [shouldSaveToQuiz, setShouldSaveToQuiz] = useState(false);
  const [selectedFromDate, setSelectedFromDate] = useState<string>(faktum.svar?.fom ?? "");
  const [selectedToDate, setSelectedToDate] = useState<string>(faktum.svar?.tom ?? "");

  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const faktumTextFra = getAppText(`${faktum.beskrivendeId}.fra`);
  const faktumTextTil = getAppText(`${faktum.beskrivendeId}.til`);

  useEffect(() => {
    if (shouldSaveToQuiz) {
      savePeriode();
    }
  }, [shouldSaveToQuiz, selectedFromDate, selectedToDate]);

  useEffect(() => {
    if (!faktum.svar && !isFirstRender) {
      resetFromDate();
      setSelectedFromDate("");
    }
  }, [faktum.svar]);

  const {
    datepickerProps: fromDatepickerProps,
    inputProps: fromInputProps,
    reset: resetFromDate,
  } = useDatepicker({
    defaultSelected: selectedFromDate !== "" ? new Date(selectedFromDate) : undefined,
    allowTwoDigitYear: false,
    onDateChange: (value?: Date) => {
      const selectedFromDate = value ? formatISO(value, { representation: "date" }) : "";
      setSelectedFromDate(selectedFromDate);
    },
    onValidate: (value) => {
      if (value.isEmpty) {
        setFromError("");
        if (shouldSaveToQuiz) {
          setShouldSaveToQuiz(false);
        }
        return;
      }

      if (value.isInvalid) {
        if (shouldSaveToQuiz) {
          setShouldSaveToQuiz(false);
        }

        setFromError(getAppText("validering.ugyldig-dato"));
        return;
      }

      if (value.isValidDate && !shouldSaveToQuiz) {
        setShouldSaveToQuiz(true);
      }
    },
  });

  const {
    datepickerProps: toDatepickerProps,
    inputProps: toInputProps,
    reset: resetToDate,
  } = useDatepicker({
    defaultSelected: selectedToDate !== "" ? new Date(selectedToDate) : undefined,
    allowTwoDigitYear: false,
    onDateChange: (value?: Date) => {
      const selectedToDate = value ? formatISO(value, { representation: "date" }) : "";
      setSelectedToDate(selectedToDate);
    },
    onValidate: (value) => {
      if (value.isEmpty) {
        setShouldSaveToQuiz(false);
        return;
      }

      if (value.isInvalid) {
        setShouldSaveToQuiz(false);
        setToError(getAppText("validering.ugyldig-dato"));
        return;
      }

      if (value.isValidDate && !shouldSaveToQuiz) {
        setShouldSaveToQuiz(true);
      }
    },
  });

  function fromDateOnBlur() {
    if (selectedFromDate === "") {
      saveFaktumToQuiz(faktum, null);
      resetFromDate();
      setFromError("");
      resetToDate();
      return;
    }

    if (selectedFromDate !== "") {
      let periode: IQuizPeriodeFaktumAnswerType = { fom: selectedFromDate };
      if (selectedToDate) {
        periode = { ...periode, tom: selectedToDate };
      }

      const isValidPeriode = validateAndIsValidPeriode(periode);

      if (isValidPeriode) {
        resetFromDate();
        saveFaktumToQuiz(faktum, periode);
      } else {
        saveFaktumToQuiz(faktum, null);
      }
    }
  }

  function toDateOnBlur() {
    if (selectedToDate === "") {
      setToError("");
      resetToDate();
      saveFaktumToQuiz(faktum, { fom: selectedFromDate });
      return;
    }

    if (selectedToDate !== "") {
      const periode = { fom: selectedFromDate, tom: selectedToDate };
      const isValidPeriode = validateAndIsValidPeriode(periode);

      if (isValidPeriode) {
        saveFaktumToQuiz(faktum, periode);
      } else {
        resetToDate();
        saveFaktumToQuiz(faktum, { fom: selectedFromDate });
      }
    }
  }

  function savePeriode() {
    let periode: IQuizPeriodeFaktumAnswerType = { fom: selectedFromDate };

    if (selectedToDate) {
      if (isBefore(new Date(selectedToDate), new Date(selectedFromDate))) {
        setToError("Til dato kan ikke være før fra dato");
        return;
      }

      periode = { ...periode, tom: selectedToDate };
    }

    const isValidPeriode = validateAndIsValidPeriode(periode);
    if (isValidPeriode) {
      saveFaktumToQuiz(faktum, periode);
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

        <DatePicker
          {...fromDatepickerProps}
          fromDate={DATEPICKER_FROM_DATE}
          toDate={DATEPICKER_TO_DATE}
          strategy="fixed"
          dropdownCaption
        >
          <DatePicker.Input
            {...fromInputProps}
            label={faktumTextFra}
            placeholder={getAppText("datovelger.dato-format")}
            error={fromError}
            disabled={isLocked}
            onBlur={fromDateOnBlur}
          />
        </DatePicker>

        <DatePicker
          {...toDatepickerProps}
          fromDate={DATEPICKER_FROM_DATE}
          toDate={DATEPICKER_TO_DATE}
          strategy="fixed"
          dropdownCaption
        >
          <DatePicker.Input
            {...toInputProps}
            label={faktumTextTil}
            placeholder={getAppText("datovelger.dato-format")}
            error={toError}
            disabled={isLocked}
            onBlur={toDateOnBlur}
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
