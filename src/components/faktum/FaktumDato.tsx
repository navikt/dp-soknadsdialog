import { BodyShort, Label } from "@navikt/ds-react";
import { formatISO } from "date-fns";
import { useEffect, useState } from "react";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { useValidateFaktumDato } from "../../hooks/faktum/useValidateFaktumDato";
import { IQuizDatoFaktum } from "../../types/quiz.types";
import { DatePicker } from "../date-picker/DatePicker";
import { FormattedDate } from "../FormattedDate";
import { HelpText } from "../HelpText";
import { IFaktum } from "./Faktum";
import styles from "./Faktum.module.css";

export function FaktumDato(props: IFaktum<IQuizDatoFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { unansweredFaktumId } = useValidation();
  const { getFaktumTextById } = useSanity();
  const faktumTexts = getFaktumTextById(props.faktum.beskrivendeId);

  const [currentAnswer, setCurrentAnswer] = useState(props.faktum.svar);

  const { hasError, hasWarning, setHasWarning, getErrorMessage, isValidDate } =
    useValidateFaktumDato(faktum);

  useEffect(() => {
    if (props.faktum.svar) {
      const hasWarning = !isValidDate(new Date(props.faktum.svar));
      setHasWarning(hasWarning);
    }
  }, []);

  const onDateSelection = (value: Date) => {
    const date = formatISO(value, { representation: "date" });
    setCurrentAnswer(date);
    onChange ? onChange(faktum, date) : saveFaktum(date);
  };

  function saveFaktum(value: string) {
    const inputValid = isValidDate(new Date(value));

    if (inputValid) {
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
        hasError={hasError !== false || unansweredFaktumId === faktum.id}
        errorMessage={getErrorMessage()}
        hasWarning={hasWarning}
        required
      />
      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
    </>
  );
}
