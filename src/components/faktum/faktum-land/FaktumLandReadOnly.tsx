import React from "react";
import { useSanity } from "../../../context/sanity-context";
import { BodyShort, Label } from "@navikt/ds-react";
import { IQuizLandFaktum } from "../../../types/quiz.types";
import { getCountryName } from "../../../country.utils";
import { useRouter } from "next/router";
import { IFaktumReadOnly } from "../Faktum";
import { HelpText } from "../../HelpText";
import styles from "../Faktum.module.css";
import { PortableText } from "@portabletext/react";

export function FaktumLandReadOnly(props: IFaktumReadOnly<IQuizLandFaktum>) {
  const router = useRouter();
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
        {faktum.svar ? getCountryName(faktum.svar, router.locale) : faktum.svar}
      </BodyShort>

      {showAllFaktumTexts && faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
    </>
  );
}
