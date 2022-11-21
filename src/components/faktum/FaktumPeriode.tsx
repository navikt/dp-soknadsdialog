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
import { isFromYear1900 } from "./validation/validations.utils";
import { useValidation } from "../../context/validation-context";

type validationErrorFomType = "futureDate" | "invalidDate";

export function FaktumPeriode(props: IFaktum<IQuizPeriodeFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { unansweredFaktumId } = useValidation();
  const { getFaktumTextById, getAppText } = useSanity();
  const [hasErrorFom, setHasErrorFom] = useState<validationErrorFomType | boolean>(false);
  const [hasErrorTom, serHasErrorTom] = useState(false);
  const [svar, setSvar] = useState<IQuizPeriodeFaktumAnswerType | undefined>(props.faktum.svar);

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

  function isValidPeriode(svar: IQuizPeriodeFaktumAnswerType) {
    const { fom, tom } = svar;
    let validPeriode = true;

    if (fom) {
      const future = isFuture(new Date(fom));
      const isValidFromDate = isFromYear1900(new Date(fom));

      if (future) {
        setHasErrorFom("futureDate");
      } else if (!isValidFromDate) {
        setHasErrorFom("invalidDate");
      } else {
        setHasErrorFom(false);
      }

      validPeriode = !future && isValidFromDate;
    }

    if (tom) {
      const tomDate = new Date(tom).getTime();
      const fomDate = new Date(fom).getTime();
      const validTom = tomDate >= fomDate && isFromYear1900(new Date(fom));

      serHasErrorTom(!validTom);
      validPeriode = validTom;
    }

    return validPeriode;
  }

  function getFomErrorMessage() {
    if (hasErrorFom && faktum.beskrivendeId === "faktum.arbeidsforhold.varighet") {
      return getAppText("validering.arbeidsforhold.varighet-fra");
    } else if (hasErrorFom === "invalidDate") {
      return getAppText("validering.ugyldig-dato");
    } else {
      return faktumTexts?.errorMessage ? faktumTexts.errorMessage : faktum.beskrivendeId;
    }
  }

  function getValidationMessage() {
    if (hasErrorFom) {
      return getFomErrorMessage();
    } else if (unansweredFaktumId === faktum.id) {
      return getAppText("validering.faktum.ubesvart");
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
            hasError={hasErrorFom !== false || unansweredFaktumId === faktum.id}
            errorMessage={getValidationMessage()}
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
            hasError={hasErrorTom}
            errorMessage={getAppText("validering.arbeidsforhold.varighet-til")}
          />
        </div>
      </Fieldset>
    </div>
  );
}
