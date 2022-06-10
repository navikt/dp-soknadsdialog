import { PortableText } from "@portabletext/react";
import React, { ChangeEvent, useState } from "react";
import { Dropdown, DropdownOption } from "../dropdown/Dropdown";
import { FaktumProps } from "./Faktum";
import { QuizLandFaktum } from "../../types/quiz.types";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { SanityLandGruppe } from "../../types/sanity.types";
import { AlertText } from "../AlertText";
import { useRouter } from "next/router";
import { ReadMore } from "@navikt/ds-react";
import countries, { getName } from "i18n-iso-countries";
import bokmalLocale from "i18n-iso-countries/langs/nb.json";
import nynorskLocale from "i18n-iso-countries/langs/nn.json";
import englishLocale from "i18n-iso-countries/langs/en.json";
import styles from "./Faktum.module.css";

export function FaktumLand(props: FaktumProps<QuizLandFaktum>) {
  const router = useRouter();
  const { faktum, onChange } = props;
  const { getFaktumTextById, getLandGruppeTextById } = useSanity();
  const { saveFaktumToQuiz } = useQuiz();

  const [currentAnswer, setCurrentAnswer] = useState(faktum.svar);
  const [currentLandGruppeText, setCurrentLandGruppeText] = useState<
    SanityLandGruppe | undefined
  >();

  const sortByLabel = (optionA: DropdownOption, optionB: DropdownOption) => {
    if (optionA.label === optionB.label) return 0;
    return optionA.label > optionB.label ? 1 : -1;
  };
  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const options = faktum.gyldigeLand
    .map((code) => ({
      value: code,
      label: getName(code, setLocale(router.locale)),
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

  return (
    <div className={styles.landFaktumReadMore}>
      <Dropdown
        label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
        description={faktumTexts?.description && <PortableText value={faktumTexts.description} />}
        onChange={onSelect}
        options={options}
        currentValue={currentAnswer || "Velg et land"}
        placeHolderText={"Velg et land"}
      />
      {faktumTexts?.helpText && (
        <div className={styles.landFaktumReadMore}>
          <ReadMore header={faktumTexts.helpText.title}>
            <PortableText value={faktumTexts.helpText.body} />
          </ReadMore>
        </div>
      )}
      {currentLandGruppeText?.alertText && (
        <AlertText alertText={currentLandGruppeText.alertText} inAccordion />
      )}
    </div>
  );
}

function setLocale(locale: string | undefined): string {
  switch (locale) {
    case "nb":
      countries.registerLocale(bokmalLocale);
      return "nb";
    case "nn":
      countries.registerLocale(nynorskLocale);
      return "nn";
    case "en":
      countries.registerLocale(englishLocale);
      return "en";

    default:
      countries.registerLocale(bokmalLocale);
      return "nb";
  }
}
