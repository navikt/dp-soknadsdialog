import { PortableText } from "@portabletext/react";
import React, { ChangeEvent, useState } from "react";
import { getCountryDropdownOptionsForFaktum } from "../../country.utils";
import { Dropdown } from "../input/dropdown/Dropdown";
import { FaktumProps } from "./Faktum";
import { QuizLandFaktum } from "../../types/quiz.types";
import { getFaktumSanityText } from "../../hooks/getFaktumSanityText";
import { useQuiz } from "../../context/quiz-context";

export function FaktumLand(props: FaktumProps<QuizLandFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const faktumTexts = getFaktumSanityText(faktum.beskrivendeId);
  const [currentAnswer, setCurrentAnswer] = useState(faktum.svar);
  const options = getCountryDropdownOptionsForFaktum(faktum.beskrivendeId);

  function onSelect(event: ChangeEvent<HTMLSelectElement>) {
    onChange ? onChange(faktum, event.target.value) : saveFaktum(event.target.value);
    setCurrentAnswer(event.target.value);
  }

  function saveFaktum(value: string) {
    saveFaktumToQuiz(faktum.id, value);
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
    </div>
  );
}
