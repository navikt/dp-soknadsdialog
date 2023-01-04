import React from "react";
import { BodyShort, Label } from "@navikt/ds-react";
import { IQuizFlervalgFaktum } from "../../../types/quiz.types";
import { useSanity } from "../../../context/sanity-context";
import { PortableText } from "@portabletext/react";
import { HelpText } from "../../HelpText";
import styles from "../Faktum.module.css";
import { AlertText } from "../../alert-text/AlertText";
import { IFaktumReadOnly } from "../Faktum";
import { isDefined } from "../../../types/type-guards";
import { ISanityAlertText } from "../../../types/sanity.types";

export function FaktumFlervalgReadOnly(props: IFaktumReadOnly<IQuizFlervalgFaktum>) {
  const { faktum, showAllFaktumTexts } = props;
  const { getFaktumTextById, getSvaralternativTextById } = useSanity();

  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const alertTexts: ISanityAlertText[] | undefined = faktum.svar
    ?.map((answer) => getSvaralternativTextById(answer)?.alertText)
    .filter(isDefined);

  return (
    <>
      <Label>{faktumTexts ? faktumTexts.text : faktum.beskrivendeId}</Label>

      {showAllFaktumTexts && faktumTexts?.description && (
        <PortableText value={faktumTexts.description} />
      )}

      <div>
        {showAllFaktumTexts && <strong>Svar: </strong>}
        {faktum.svar?.map((textId) => (
          <BodyShort key={textId}>{getSvaralternativTextById(textId)?.text}</BodyShort>
        ))}
      </div>

      {showAllFaktumTexts && faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}

      {showAllFaktumTexts &&
        alertTexts?.map((sanityText, index) => {
          return (
            (sanityText?.body || sanityText?.title) && (
              <AlertText key={index} alertText={sanityText} spacingTop />
            )
          );
        })}
    </>
  );
}
