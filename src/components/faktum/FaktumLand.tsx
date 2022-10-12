import { PortableText } from "@portabletext/react";
import React, { ChangeEvent, useState } from "react";
import { Dropdown, IDropdownOption } from "../dropdown/Dropdown";
import { IFaktum } from "./Faktum";
import { IQuizLandFaktum } from "../../types/quiz.types";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { ISanityLandGruppe } from "../../types/sanity.types";
import { AlertText } from "../AlertText";
import { useRouter } from "next/router";
import { BodyShort, Label } from "@navikt/ds-react";
import styles from "./Faktum.module.css";
import { getCountryName } from "../../country.utils";
import { HelpText } from "../HelpText";
import { useValidation } from "../../context/validation-context";

export function FaktumLand(props: IFaktum<IQuizLandFaktum>) {
  const router = useRouter();
  const { faktum, onChange } = props;
  const { getFaktumTextById, getLandGruppeTextById, getAppTekst } = useSanity();
  const { saveFaktumToQuiz } = useQuiz();
  const { unansweredFaktum } = useValidation();

  const [currentAnswer, setCurrentAnswer] = useState(faktum.svar);
  const [currentLandGruppeText, setCurrentLandGruppeText] = useState<
    ISanityLandGruppe | undefined
  >();

  const sortByLabel = (optionA: IDropdownOption, optionB: IDropdownOption) => {
    if (optionA.label === optionB.label) return 0;
    return optionA.label > optionB.label ? 1 : -1;
  };
  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const options = faktum.gyldigeLand
    .map((code) => ({
      value: code,
      label: getCountryName(code, router.locale),
    }))
    .sort(sortByLabel);

  function onSelect(event: ChangeEvent<HTMLSelectElement>) {
    onChange ? onChange(faktum, event.target.value) : saveFaktum(event.target.value);
    setCurrentAnswer(event.target.value);

    const landGruppeId = getLandGruppeIdByAlpha3Code(event.target.value);
    setCurrentLandGruppeText(getLandGruppeTextById(landGruppeId));
  }

  function saveFaktum(value: string) {
    saveFaktumToQuiz(faktum, value);
  }

  function getLandGruppeIdByAlpha3Code(code: string) {
    return faktum.grupper.find((group) => group.land.includes(code))?.gruppeId;
  }

  if (props.faktum.readOnly || props.readonly) {
    return (
      <>
        <Label>{faktumTexts ? faktumTexts.text : faktum.beskrivendeId}</Label>
        <BodyShort>
          {props.faktum.svar ? getCountryName(props.faktum.svar, router.locale) : props.faktum.svar}
        </BodyShort>
      </>
    );
  }

  return (
    <>
      <Dropdown
        label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
        description={faktumTexts?.description && <PortableText value={faktumTexts.description} />}
        onChange={onSelect}
        options={options}
        currentValue={currentAnswer || "Velg et land"}
        placeHolderText={"Velg et land"}
        error={
          unansweredFaktum?.beskrivendeId === faktum.beskrivendeId
            ? getAppTekst("validering.ubesvart-faktum.varsel-tekst")
            : undefined
        }
      />
      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
      {currentLandGruppeText?.alertText && (
        <AlertText alertText={currentLandGruppeText.alertText} />
      )}
    </>
  );
}
