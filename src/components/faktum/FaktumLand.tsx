import { PortableText } from "@portabletext/react";
import React, { ChangeEvent, useState } from "react";
import { Dropdown } from "../dropdown/Dropdown";
import { FaktumProps } from "./Faktum";
import { QuizLandFaktum } from "../../types/quiz.types";
import { useFaktumSanityText } from "../../hooks/useFaktumSanityText";
import { useQuiz } from "../../context/quiz-context";
import { getName } from "i18n-iso-countries";
import { useSanity } from "../../context/sanity-context";
import { SanityLandGruppe } from "../../types/sanity.types";
import { AlertText } from "../AlertText";
import { useRouter } from "next/router";
import { ReadMore } from "@navikt/ds-react";

export function FaktumLand(props: FaktumProps<QuizLandFaktum>) {
  const router = useRouter();
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { landgrupper } = useSanity();

  const faktumTexts = useFaktumSanityText(faktum.beskrivendeId);

  const [currentAnswer, setCurrentAnswer] = useState(faktum.svar);
  const [currentCountryGroupText, setCurrentCountryGroupText] = useState<
    SanityLandGruppe | undefined
  >();

  const options = faktum.gyldigeLand.map((code) => ({
    value: code,
    label: getName(code, router.locale || "nb"),
  }));

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

  return (
    <div>
      {faktumTexts?.description && <PortableText value={faktumTexts.description} />}
      <Dropdown
        label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
        onChange={onSelect}
        options={options}
        currentValue={currentAnswer || "Velg et land"}
        placeHolderText={"Velg et land"}
      />
      {faktumTexts?.helpText && (
        <ReadMore header={faktumTexts.helpText.title}>
          <PortableText value={faktumTexts.helpText.body} />
        </ReadMore>
      )}
      {currentCountryGroupText?.alertText && (
        <AlertText alertText={currentCountryGroupText.alertText} inAccordion />
      )}
    </div>
  );
}
