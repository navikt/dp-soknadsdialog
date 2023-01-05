import React from "react";
import { BodyShort, Label } from "@navikt/ds-react";
import { IQuizPeriodeFaktum } from "../../../types/quiz.types";
import { IFaktumReadOnly } from "../Faktum";
import { FormattedDate } from "../../FormattedDate";
import { useSanity } from "../../../context/sanity-context";
import { PortableText } from "@portabletext/react";
import { HelpText } from "../../HelpText";
import styles from "./FaktumPeriode.module.css";

export function FaktumPeriodeReadOnly(props: IFaktumReadOnly<IQuizPeriodeFaktum>) {
  const { faktum, showAllFaktumTexts } = props;
  const { getFaktumTextById, getAppText } = useSanity();
  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const faktumTextFra = getAppText(`${faktum.beskrivendeId}.fra`);
  const faktumTextTil = getAppText(`${faktum.beskrivendeId}.til`);

  return (
    <div className={styles.faktumPeriode}>
      <Label className={styles.readOnlyTittel}>
        {faktumTexts ? faktumTexts.text : faktum.beskrivendeId}
      </Label>

      {showAllFaktumTexts && faktumTexts?.description && (
        <PortableText value={faktumTexts.description} />
      )}

      {faktum.svar?.fom && (
        <div className={styles.faktumPeriodeFra}>
          <Label>{faktumTextFra}</Label>
          <BodyShort>
            <FormattedDate date={faktum.svar?.fom} />
          </BodyShort>
        </div>
      )}

      {faktum.svar?.tom && (
        <div>
          <Label>{faktumTextTil}</Label>
          <BodyShort>
            <FormattedDate date={faktum.svar?.tom} />
          </BodyShort>
        </div>
      )}

      {showAllFaktumTexts && faktumTexts?.helpText && (
        <HelpText
          className={styles.helpTextSpacing}
          helpText={faktumTexts.helpText}
          defaultOpen={true}
        />
      )}
    </div>
  );
}
