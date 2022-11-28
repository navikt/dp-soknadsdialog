import { BodyShort, Label } from "@navikt/ds-react";
import { formatISO } from "date-fns";
import { useEffect, useState } from "react";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { useValidateFaktumDato } from "../../hooks/faktum/useValidateFaktumDato";
import { IQuizDatoFaktum } from "../../types/quiz.types";
import { DatePicker } from "../date-picker/DatePicker";
import { FormattedDate } from "../FormattedDate";
import { HelpText } from "../HelpText";
import { IFaktum } from "./Faktum";
import styles from "./Faktum.module.css";
import { useFirstRender } from "../../hooks/useFirstRender";

export function FaktumDato(props: IFaktum<IQuizDatoFaktum>) {
  const { faktum, onChange } = props;
  const isFirstRender = useFirstRender();
  const { saveFaktumToQuiz } = useQuiz();
  const { getFaktumTextById } = useSanity();
  const faktumTexts = getFaktumTextById(props.faktum.beskrivendeId);

  const [currentAnswer, setCurrentAnswer] = useState(props.faktum.svar);

  const { getErrorMessage, isValid, getWarningMessage } = useValidateFaktumDato(faktum);

  useEffect(() => {
    if (faktum.svar === undefined && !isFirstRender) {
      setCurrentAnswer("");
    }
  }, [faktum.svar]);

  const onDateSelection = (value: Date | null) => {
    if (value) {
      const date = formatISO(value, { representation: "date" });
      setCurrentAnswer(date);
      onChange ? onChange(faktum, date) : saveFaktum(date);
    }
  };

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

  return (
    <>
      <DatePicker
        id={props.faktum.beskrivendeId}
        value={currentAnswer}
        onChange={onDateSelection}
        label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
        description={faktumTexts?.description}
        error={getErrorMessage()}
        warning={getWarningMessage()}
        required
      />
      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
    </>
  );
}
