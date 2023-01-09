import React from "react";
import { BodyShort, Label } from "@navikt/ds-react";
import { FormattedDate } from "../../FormattedDate";
import { useSanity } from "../../../context/sanity-context";
import { IQuizDatoFaktum } from "../../../types/quiz.types";
import { PortableText } from "@portabletext/react";
import { HelpText } from "../../HelpText";
import { IFaktumReadOnly } from "../Faktum";
import styles from "../Faktum.module.css";

export function FaktumDatoReadOnly(props: IFaktumReadOnly<IQuizDatoFaktum>) {
  const { faktum, showAllFaktumTexts } = props;
  const { getFaktumTextById, getAppText } = useSanity();
  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);

  return (
    <>
      <Label as={"p"}>{faktumTexts ? faktumTexts.text : faktum.beskrivendeId}</Label>

      {showAllFaktumTexts && faktumTexts?.description && (
        <PortableText value={faktumTexts.description} />
      )}

      <BodyShort>
        {showAllFaktumTexts && <strong>{getAppText("pdf.faktum.svar")}</strong>}
        {faktum.svar && <FormattedDate date={faktum.svar} />}
      </BodyShort>

      {showAllFaktumTexts && faktumTexts?.helpText && (
        <HelpText
          className={styles.helpTextSpacing}
          helpText={faktumTexts.helpText}
          defaultOpen={true}
        />
      )}
    </>
  );
}
