import { Alert, BodyShort, Label, UNSAFE_DatePicker, UNSAFE_useDatepicker } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { addYears, formatISO } from "date-fns";
import { useEffect, useState } from "react";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { useValidateFaktumDato } from "../../hooks/faktum/useValidateFaktumDato";
import { useFirstRender } from "../../hooks/useFirstRender";
import { IQuizDatoFaktum } from "../../types/quiz.types";
import { FormattedDate } from "../FormattedDate";
import { HelpText } from "../HelpText";
import { IFaktum } from "./Faktum";
import styles from "./Faktum.module.css";

const fromDate = new Date("1900-01-01");
const toDate = addYears(new Date(), 100);

export function FaktumDato(props: IFaktum<IQuizDatoFaktum>) {
  const { faktum, onChange } = props;
  const isFirstRender = useFirstRender();
  const { saveFaktumToQuiz } = useQuiz();
  const { getFaktumTextById, getAppText } = useSanity();
  const faktumTexts = getFaktumTextById(props.faktum.beskrivendeId);
  const [currentAnswer, setCurrentAnswer] = useState(props.faktum.svar);
  const { getErrorMessage, isValid, getHasWarning } = useValidateFaktumDato(faktum);

  useEffect(() => {
    if (!faktum.svar && !isFirstRender) {
      setCurrentAnswer("");
    }
  }, [faktum.svar]);

  const { datepickerProps, inputProps } = UNSAFE_useDatepicker({
    defaultSelected: currentAnswer ? new Date(currentAnswer) : undefined,
    onDateChange: (value?: Date) => {
      if (!value) {
        setCurrentAnswer("");
        onChange ? onChange(faktum, null) : saveFaktumToQuiz(faktum, null);
      } else {
        const date = formatISO(value, { representation: "date" });
        setCurrentAnswer(date);
        onChange ? onChange(faktum, date) : saveFaktum(date);
      }
    },
  });

  function saveFaktum(value: string) {
    const isValidDate = isValid(new Date(value));

    if (isValidDate) {
      saveFaktumToQuiz(faktum, value);
    }
  }

  if (props.faktum.readOnly || props.readonly) {
    return (
      <>
        <Label>{faktumTexts ? faktumTexts.text : faktum.beskrivendeId}</Label>
        <BodyShort>{currentAnswer ? <FormattedDate date={currentAnswer} /> : ""}</BodyShort>
      </>
    );
  }

  const datePickerDescription = faktumTexts?.description ? (
    <PortableText value={faktumTexts.description} />
  ) : undefined;

  const hasWarning = currentAnswer && getHasWarning(new Date(currentAnswer));

  return (
    <>
      <UNSAFE_DatePicker
        {...datepickerProps}
        dropdownCaption
        fromDate={fromDate}
        toDate={toDate}
        strategy="fixed"
      >
        <UNSAFE_DatePicker.Input
          {...inputProps}
          id={props.faktum.beskrivendeId}
          label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
          description={datePickerDescription}
          error={getErrorMessage()}
        />
      </UNSAFE_DatePicker>
      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
      {hasWarning && (
        <Alert variant="warning" className={styles.faktumDatoWarningSpacing}>
          {getAppText("validering.dato-faktum.soknadsdato-varsel")}
        </Alert>
      )}
    </>
  );
}
