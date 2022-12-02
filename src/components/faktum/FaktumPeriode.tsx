import React, { useEffect, useState } from "react";
import { IFaktum } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { addYears, formatISO } from "date-fns";
import { IQuizPeriodeFaktum, IQuizPeriodeFaktumAnswerType } from "../../types/quiz.types";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import {
  BodyShort,
  Fieldset,
  Label,
  UNSAFE_DatePicker,
  UNSAFE_useRangeDatepicker,
} from "@navikt/ds-react";
import { HelpText } from "../HelpText";
import styles from "./Faktum.module.css";
import periodeStyles from "./FaktumPeriode.module.css";
import { FormattedDate } from "../FormattedDate";
import { useValidateFaktumPeriode } from "../../hooks/faktum/useValidateFaktumPeriode";
import { useFirstRender } from "../../hooks/useFirstRender";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";

interface IDateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

const FROM_DATE = new Date("1900-01-01");
const TO_DATE = addYears(new Date(), 100);

export function FaktumPeriode(props: IFaktum<IQuizPeriodeFaktum>) {
  const { faktum, onChange } = props;
  const isFirstRender = useFirstRender();
  const { saveFaktumToQuiz } = useQuiz();
  const { getFaktumTextById, getAppText } = useSanity();
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
  });

  function handleDateChange(value?: IDateRange) {
    if (value && !value.from) {
      setCurrentAnswer(undefined);
      debouncedChange(null);
    }

    if (value && value.from) {
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
          fromDate={FROM_DATE}
          toDate={TO_DATE}
          strategy="fixed"
        >
          <div className={periodeStyles.datePickerSpacing}>
            <UNSAFE_DatePicker.Input
              {...fromInputProps}
              id={beskrivendeIdFra}
              label={faktumTextFra}
              error={getFomErrorMessage()}
            />
            <UNSAFE_DatePicker.Input
              {...toInputProps}
              id={beskrivendeIdTil}
              label={faktumTextTil}
              error={getTomErrorMessage()}
            />
          </div>
        </UNSAFE_DatePicker>
      </Fieldset>
    </div>
  );
}
