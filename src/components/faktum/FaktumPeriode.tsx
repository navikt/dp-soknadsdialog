import React, { useEffect, useState } from "react";
import { IFaktum } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { formatISO } from "date-fns";
import { IQuizPeriodeFaktum, IQuizPeriodeFaktumAnswerType } from "../../types/quiz.types";
import { useQuiz } from "../../context/quiz-context";
import { DatePicker } from "../date-picker/DatePicker";
import { useSanity } from "../../context/sanity-context";
import { BodyShort, Fieldset, Label } from "@navikt/ds-react";
import { HelpText } from "../HelpText";
import styles from "./Faktum.module.css";
import periodeStyles from "./FaktumPeriode.module.css";
import { FormattedDate } from "../FormattedDate";
import { useValidateFaktumPeriode } from "../../hooks/faktum/useValidateFaktumPeriode";

export function FaktumPeriode(props: IFaktum<IQuizPeriodeFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { getFaktumTextById, getAppText } = useSanity();
  const [svar, setSvar] = useState<IQuizPeriodeFaktumAnswerType | undefined>(props.faktum.svar);
  const { isValidPeriode, getTomErrorMessage, getFomErrorMessage } =
    useValidateFaktumPeriode(faktum);

  const beskrivendeIdFra = `${props.faktum.beskrivendeId}.fra`;
  const beskrivendeIdTil = `${props.faktum.beskrivendeId}.til`;

  const faktumTexts = getFaktumTextById(props.faktum.beskrivendeId);
  const faktumTextFra = getAppText(beskrivendeIdFra);
  const faktumTextTil = getAppText(beskrivendeIdTil);

  useEffect(() => {
    setSvar(props.faktum.svar ? props.faktum.svar : undefined);
  }, [props.faktum.svar]);

  function onFromDateSelection(value: Date) {
    const parsedFromDate = formatISO(value, { representation: "date" });
    const period = { ...svar, fom: parsedFromDate };
    setSvar(period);

    onChange ? onChange(faktum, period) : saveFaktum(period);
  }

  function onToDateSelection(value: Date) {
    if (!svar?.fom) {
      return;
    }

    const parsedToDate = formatISO(value, { representation: "date" });
    const period = { ...svar, tom: parsedToDate };
    setSvar(period);

    onChange ? onChange(faktum, period) : saveFaktum(period);
  }

  function saveFaktum(svar: IQuizPeriodeFaktumAnswerType) {
    const isValid = isValidPeriode(svar);

    if (isValid) {
      saveFaktumToQuiz(faktum, svar);
    }
  }

  if (props.faktum.readOnly || props.readonly) {
    return (
      <div className={periodeStyles.faktumPeriode}>
        <Label className={periodeStyles.readOnlyTittel}>
          {faktumTexts ? faktumTexts.text : faktum.beskrivendeId}
        </Label>
        {svar?.fom && (
          <div className={periodeStyles.faktumPeriodeFra}>
            <Label>{faktumTextFra}</Label>
            <BodyShort>
              <FormattedDate date={svar?.fom} />
            </BodyShort>
          </div>
        )}
        {svar?.tom && (
          <div>
            <Label>{faktumTextTil}</Label>
            <BodyShort>
              <FormattedDate date={svar?.tom} />
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

        <div className={periodeStyles.faktumPeriodeFra}>
          <DatePicker
            id={beskrivendeIdFra}
            label={faktumTextFra}
            onChange={onFromDateSelection}
            value={svar?.fom}
            error={getFomErrorMessage()}
            required
          />
        </div>
        <div>
          <DatePicker
            id={beskrivendeIdTil}
            label={faktumTextTil}
            disabled={!svar?.fom}
            onChange={onToDateSelection}
            value={svar?.tom}
            min={svar?.fom}
            error={getTomErrorMessage()}
          />
        </div>
      </Fieldset>
    </div>
  );
}
