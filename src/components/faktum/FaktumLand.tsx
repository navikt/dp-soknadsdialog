import { PortableText } from "@portabletext/react";
import React, { ChangeEvent, useState } from "react";
import { Dropdown } from "../input/dropdown/Dropdown";
import { FaktumProps } from "./Faktum";
import { QuizLandFaktum } from "../../types/quiz.types";
import { useFaktumSanityText } from "../../hooks/useFaktumSanityText";
import { useQuiz } from "../../context/quiz-context";
import countries, { getName } from "i18n-iso-countries";
import norwegianLocale from "i18n-iso-countries/langs/nb.json";
import { useSanity } from "../../context/sanity-context";
import { SanityLandGruppe } from "../../types/sanity.types";
import { AlertText } from "../AlertText";

countries.registerLocale(norwegianLocale);

export function FaktumLand(props: FaktumProps<QuizLandFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { landgrupper } = useSanity();

  const faktumTexts = useFaktumSanityText(faktum.beskrivendeId);
  const [currentAnswer, setCurrentAnswer] = useState(faktum.svar);
  const [currentCountryGroupText, setCurrentCountryGroupText] = useState<
    SanityLandGruppe | undefined
  >(undefined);
  const options = faktum.gyldigeLand.map(toDropDownOption);

  function toDropDownOption(code: string) {
    return {
      value: code,
      label: getName(code, "nb"),
    };
  }

  function onSelect(event: ChangeEvent<HTMLSelectElement>) {
    onChange ? onChange(faktum, event.target.value) : saveFaktum(event.target.value);
    setCurrentAnswer(event.target.value);

    setCurrentCountryGroupText(
      landgrupper.find(
        (gruppe) => gruppe.textId === getLandGruppeIdByAlpha3Code(event.target.value)
      )
    );
  }

  function saveFaktum(value: string) {
    saveFaktumToQuiz(faktum, value);
  }

  function getLandGruppeIdByAlpha3Code(code: string) {
    return faktum.grupper.find((group) => group.land.includes(code))?.gruppeId;
  }

  function gruppeAlertBox(groupText: SanityLandGruppe) {
    if (!groupText.alertText) return <></>;
    return <AlertText {...groupText.alertText} />;
  }

  return (
    <div>
      {faktumTexts?.description && <PortableText value={faktumTexts.description} />}
      {faktumTexts?.helpText && <p>{faktumTexts.helpText.title}</p>}

      <Dropdown
        label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
        onChange={onSelect}
        options={options}
        currentValue={currentAnswer || "Velg et land"}
        placeHolderText={"Velg et land"}
      />

      {currentCountryGroupText && gruppeAlertBox(currentCountryGroupText)}
    </div>
  );
}
