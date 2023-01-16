import React from "react";
import { BodyShort, Label } from "@navikt/ds-react";
import { IQuizTekstFaktum } from "../../../types/quiz.types";
import { IFaktumReadOnly } from "../Faktum";
import { useSanity } from "../../../context/sanity-context";
import { HelpText } from "../../HelpText";
import { PortableText } from "@portabletext/react";
import styles from "../Faktum.module.css";

export function FaktumTextReadOnly(props: IFaktumReadOnly<IQuizTekstFaktum>) {
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
        {faktum.svar}
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
