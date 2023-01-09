import React from "react";
import { BodyShort, Label } from "@navikt/ds-react";
import { IQuizBooleanFaktum } from "../../../types/quiz.types";
import { useSanity } from "../../../context/sanity-context";
import { booleanToTextId } from "./FaktumBoolean";
import { IFaktumReadOnly } from "../Faktum";
import { PortableText } from "@portabletext/react";
import { HelpText } from "../../HelpText";
import { AlertText } from "../../alert-text/AlertText";
import styles from "../Faktum.module.css";

export function FaktumBooleanReadOnly(props: IFaktumReadOnly<IQuizBooleanFaktum>) {
  const { faktum, showAllFaktumTexts } = props;
  const { getFaktumTextById, getSvaralternativTextById, getAppText } = useSanity();

  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const faktumAnswer = booleanToTextId(faktum);
  const alertText = getSvaralternativTextById(faktumAnswer || "")?.alertText;

  return (
    <>
      <Label as={"p"}>{faktumTexts ? faktumTexts.text : faktum.beskrivendeId}</Label>

      {showAllFaktumTexts && faktumTexts?.description && (
        <PortableText value={faktumTexts.description} />
      )}

      <BodyShort>
        {showAllFaktumTexts && <strong>{getAppText("pdf.faktum.svar")}</strong>}
        {faktumAnswer && getSvaralternativTextById(faktumAnswer)?.text}
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
