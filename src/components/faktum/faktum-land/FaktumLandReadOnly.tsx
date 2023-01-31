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
import { AlertText } from "../../alert-text/AlertText";
import { getLandGruppeId } from "../../../faktum.utils";

export function FaktumLandReadOnly(props: IFaktumReadOnly<IQuizLandFaktum>) {
  const router = useRouter();
  const { faktum, showAllFaktumTexts } = props;
  const { getFaktumTextById, getAppText, getLandGruppeTextById } = useSanity();
  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);

  const landGruppeId = faktum.svar && getLandGruppeId(faktum, faktum.svar);
  const landGruppeText = getLandGruppeTextById(landGruppeId);

  return (
    <>
      <Label as={"p"}>{faktumTexts ? faktumTexts.text : faktum.beskrivendeId}</Label>

      {showAllFaktumTexts && faktumTexts?.description && (
        <PortableText value={faktumTexts.description} />
      )}

      <BodyShort>
        {showAllFaktumTexts && <strong>{getAppText("pdf.faktum.svar")}</strong>}
        {faktum.svar ? getCountryName(faktum.svar, router.locale) : faktum.svar}
      </BodyShort>

      {showAllFaktumTexts && faktumTexts?.helpText && (
        <HelpText
          className={styles.helpTextSpacing}
          helpText={faktumTexts.helpText}
          defaultOpen={true}
        />
      )}

      {showAllFaktumTexts &&
        (landGruppeText?.alertText?.title || landGruppeText?.alertText?.body) && (
          <AlertText alertText={landGruppeText.alertText} />
        )}
    </>
  );
}
