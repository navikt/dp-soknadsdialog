import React from "react";
import { BodyShort, Label } from "@navikt/ds-react";
import { IQuizEnvalgFaktum } from "../../../types/quiz.types";
import { IFaktumReadOnly } from "../Faktum";
import { useSanity } from "../../../context/sanity-context";
import { PortableText } from "@portabletext/react";
import { HelpText } from "../../HelpText";
import { AlertText } from "../../alert-text/AlertText";
import styles from "../Faktum.module.css";

export function FaktumEnvalgReadOnly(props: IFaktumReadOnly<IQuizEnvalgFaktum>) {
  const { faktum, showAllFaktumTexts } = props;
  const { getFaktumTextById, getSvaralternativTextById, getAppText } = useSanity();

  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const alertText = getSvaralternativTextById(faktum?.svar || "")?.alertText;

  return (
    <>
      <Label as={"p"}>{faktumTexts ? faktumTexts.text : faktum.beskrivendeId}</Label>

      {showAllFaktumTexts && faktumTexts?.description && (
        <PortableText value={faktumTexts.description} />
      )}

      <BodyShort>
        {showAllFaktumTexts && <strong>{getAppText("pdf.faktum.svar")}</strong>}
        {faktum.svar && getSvaralternativTextById(faktum.svar)?.text}
      </BodyShort>

      {showAllFaktumTexts && faktumTexts?.helpText && (
        <HelpText
          className={styles.helpTextSpacing}
          helpText={faktumTexts.helpText}
          defaultOpen={true}
        />
      )}

      {showAllFaktumTexts && (alertText?.body || alertText?.title) && (
        <AlertText alertText={alertText} spacingTop />
      )}
    </>
  );
}
