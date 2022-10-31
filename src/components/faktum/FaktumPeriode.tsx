import React, { useEffect, useState } from "react";
import { IFaktum } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { formatISO, isFuture } from "date-fns";
import { IQuizPeriodeFaktum, IQuizPeriodeFaktumAnswerType } from "../../types/quiz.types";
import { useQuiz } from "../../context/quiz-context";
import { DatePicker } from "../date-picker/DatePicker";
import { useSanity } from "../../context/sanity-context";
import { BodyShort, Fieldset, Label } from "@navikt/ds-react";
import { HelpText } from "../HelpText";
import styles from "./Faktum.module.css";
import periodeStyles from "./FaktumPeriode.module.css";
import { FormattedDate } from "../FormattedDate";
import { isValidDateYear } from "./validation/validations.utils";
import { useValidation } from "../../context/validation-context";

export function FaktumPeriode(props: IFaktum<IQuizPeriodeFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { unansweredFaktumId } = useValidation();
  const { getFaktumTextById, getAppText } = useSanity();
  const [isValidFom, setIsValidFom] = useState(true);
  const [isValidTom, setIsValidTom] = useState(true);
  const [svar, setSvar] = useState<IQuizPeriodeFaktumAnswerType | undefined>(props.faktum.svar);

  const beskrivendeIdFra = `${props.faktum.beskrivendeId}.fra`;
  const beskrivendeIdTil = `${props.faktum.beskrivendeId}.til`;

  const faktumTexts = getFaktumTextById(props.faktum.beskrivendeId);
  const faktumTextFra = getAppText(beskrivendeIdFra);
  const faktumTextTil = getAppText(beskrivendeIdTil);

  useEffect(() => {
    return () => {
      setSvar(undefined);
    };
  }, []);

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
    const isValidPeriode = validateInput(svar);

    if (isValidPeriode) {
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
    let validPeriode = true;

    if (fom) {
      const validFom = !isFuture(new Date(fom)) && isValidDateYear(new Date(fom));
      setIsValidFom(validFom);
      validPeriode = validFom;
    }

    if (tom) {
      const validTom =
        new Date(tom).getTime() >= new Date(fom).getTime() && isValidDateYear(new Date(fom));

      setIsValidTom(validTom);
      validPeriode = validTom;
    }

    return validPeriode;
  }

  function getFomErrorMessage() {
    if (faktum.beskrivendeId === "faktum.arbeidsforhold.varighet") {
      return getAppText("validering.arbeidsforhold.varighet-fra");
    } else {
      return faktumTexts?.errorMessage ? faktumTexts.errorMessage : faktum.beskrivendeId;
    }
  }

  function getValidationMessage() {
    if (unansweredFaktumId === faktum.id) {
      return getAppText("validering.faktum.ubesvart");
    } else if (!isValidFom) {
      return getFomErrorMessage();
    } else {
      return undefined;
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
            hasError={!isValidFom || unansweredFaktumId === faktum.id}
            errorMessage={getValidationMessage()}
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
            errorMessage={getAppText("validering.arbeidsforhold.varighet-til")}
          />
        </div>
      </Fieldset>
    </div>
  );
}
