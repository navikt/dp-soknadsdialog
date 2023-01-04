import React from "react";
import { BodyShort, Label } from "@navikt/ds-react";
import { IQuizNumberFaktum } from "../../../types/quiz.types";
import { IFaktumReadOnly } from "../Faktum";
import { useSanity } from "../../../context/sanity-context";
import { PortableText } from "@portabletext/react";
import { HelpText } from "../../HelpText";
import styles from "../Faktum.module.css";

export function FaktumNumberReadOnly(props: IFaktumReadOnly<IQuizNumberFaktum>) {
  const { faktum, showAllFaktumTexts } = props;
  const { getFaktumTextById } = useSanity();
  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);

  return (
    <>
      <Label>{faktumTexts ? faktumTexts.text : faktum.beskrivendeId}</Label>
      {showAllFaktumTexts && faktumTexts?.description && (
        <PortableText value={faktumTexts.description} />
      )}

      <BodyShort>
        {showAllFaktumTexts && <strong>Svar: </strong>}
        {faktum.svar}
      </BodyShort>

      {showAllFaktumTexts && faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
    </>
  );
}
