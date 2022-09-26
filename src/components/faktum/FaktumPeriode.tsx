import React, { useState } from "react";
import { IFaktum } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { formatISO } from "date-fns";
import { IQuizPeriodeFaktum, IQuizPeriodeFaktumAnswerType } from "../../types/quiz.types";
import { isFuture } from "date-fns";
import { useQuiz } from "../../context/quiz-context";
import { DatePicker } from "../date-picker/DatePicker";
import { useSanity } from "../../context/sanity-context";
import { BodyShort, Fieldset, Label } from "@navikt/ds-react";
import { HelpText } from "../HelpText";
import styles from "./Faktum.module.css";
import periodeStyles from "./FaktumPeriode.module.css";
import { FormattedDate } from "../FormattedDate";
import { isValidYearRange } from "./validations";

export function FaktumPeriode(props: IFaktum<IQuizPeriodeFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { getFaktumTextById, getAppTekst } = useSanity();
  const [isValidFom, setIsValidFom] = useState(true);
  const [isValidTom, setIsValidTom] = useState(true);

  const beskrivendeIdFra = `${props.faktum.beskrivendeId}.fra`;
  const beskrivendeIdTil = `${props.faktum.beskrivendeId}.til`;

  const faktumTexts = getFaktumTextById(props.faktum.beskrivendeId);
  const faktumTextFra = getAppTekst(beskrivendeIdFra);
  const faktumTextTil = getAppTekst(beskrivendeIdTil);

  const [svar, setSvar] = useState<IQuizPeriodeFaktumAnswerType | undefined>(props.faktum.svar);

  function onFromDateSelection(value: Date) {
    const parsedFromDate = formatISO(value, { representation: "date" });
    const period = { ...svar, fom: parsedFromDate };
    setSvar(period);

    validateInput(period);
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
    if (isValidFom && isValidTom) {
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

  function validateInput(svar: IQuizPeriodeFaktumAnswerType) {
    const { fom, tom } = svar;

    const from = beskrivendeIdFra === "faktum.arbeidsforhold.varighet.fra";
    const to = beskrivendeIdTil === "faktum.arbeidsforhold.varighet.til";

    if (from || to) {
      const isValidFom = !isFuture(new Date(fom)) && isValidYearRange(new Date(fom));
      const isValidTom = tom ? !isFuture(new Date(tom)) && isValidYearRange(new Date(tom)) : true;
      setIsValidFom(isValidFom);
      setIsValidTom(isValidTom);
    } else {
      setIsValidFom(true);
      setIsValidTom(true);
    }
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
            hasError={!isValidFom}
            errorMessage={
              faktumTexts?.errorMessage ? faktumTexts.errorMessage : faktum.beskrivendeId
            }
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
            hasError={!isValidTom}
            errorMessage={
              faktumTexts?.errorMessage ? faktumTexts.errorMessage : faktum.beskrivendeId
            }
          />
        </div>
      </Fieldset>
    </div>
  );
}
