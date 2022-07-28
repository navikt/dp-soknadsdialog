import React, { useEffect, useState } from "react";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { formatISO } from "date-fns";
import { QuizPeriodeFaktum, QuizPeriodeFaktumAnswerType } from "../../types/quiz.types";
import { useQuiz } from "../../context/quiz-context";
import { DatePicker } from "../date-picker/DatePicker";
import { useSanity } from "../../context/sanity-context";
import { BodyShort, Label } from "@navikt/ds-react";
import { HelpText } from "../HelpText";
import styles from "./Faktum.module.css";

export function FaktumPeriode(props: FaktumProps<QuizPeriodeFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const faktumTexts = useSanity().getFaktumTextById(props.faktum.beskrivendeId);

  const [fromDate, setFromDate] = useState<Date | undefined>(
    faktum.svar?.fom ? new Date(faktum.svar?.fom) : undefined
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    faktum.svar?.tom ? new Date(faktum.svar?.tom) : undefined
  );

  useEffect(() => {
    if (fromDate) {
      const parsedFromDate = formatISO(fromDate, { representation: "date" });
      const period = { ...faktum.svar, fom: parsedFromDate };
      onChange ? onChange(faktum, period) : saveFaktum(period);
    }
  }, [fromDate]);

  useEffect(() => {
    if (toDate) {
      const parsedToDate = formatISO(toDate, { representation: "date" });
      // toDate is disabled until fromDate is answered. CurrentAnswer will always contain fromDate so it's safe to cast as QuizPeriodeFaktumAnswerType
      const period = { ...faktum.svar, tom: parsedToDate } as QuizPeriodeFaktumAnswerType;
      onChange ? onChange(faktum, period) : saveFaktum(period);
    }
  }, [toDate]);

  function saveFaktum(value: QuizPeriodeFaktumAnswerType) {
    saveFaktumToQuiz(faktum, value);
  }

  if (props.faktum.readOnly || props.readonly) {
    return (
      <>
        <Label>{faktumTexts ? faktumTexts.text : faktum.beskrivendeId}</Label>
        <BodyShort>
          {fromDate?.toLocaleDateString()} – {toDate?.toLocaleDateString()}
        </BodyShort>
      </>
    );
  }

  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      {faktumTexts?.description && <PortableText value={faktumTexts.description} />}
      <DatePicker
        label={"Fra dato"}
        onChange={setFromDate}
        value={fromDate ? fromDate.toISOString() : undefined}
      />
      <DatePicker
        label={"Til dato"}
        disabled={!fromDate}
        onChange={setToDate}
        value={toDate ? toDate.toISOString() : undefined}
      />
      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
    </div>
  );
}
