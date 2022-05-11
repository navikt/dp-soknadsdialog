import React, { ChangeEvent, useState } from "react";
import { FaktumProps } from "../Faktum";
import { Dropdown, DropdownOption } from "../../input/dropdown/Dropdown";
import { QuizNumberFaktum } from "../../../types/quiz.types";
import { getFaktumSanityText } from "../../../hooks/getFaktumSanityText";

const years: DropdownOption[] = [];
const currentYear = new Date().getUTCFullYear();

for (let i = 0; i <= 4; i++) {
  const year = `${currentYear - i}`;
  years.push({ value: year, label: year });
}

export function FaktumEgetGaardsbrukArbeidsaar(props: FaktumProps<QuizNumberFaktum>) {
  const { faktum } = props;
  const faktumTexts = getFaktumSanityText(props.faktum.beskrivendeId);
  const [currentAnswer, setCurrentAnswer] = useState(faktum.svar);

  function handleOnSelect(event: ChangeEvent<HTMLSelectElement>) {
    const value = parseInt(event.target.value);
    setCurrentAnswer(value);
    props.onChange ? props.onChange(props.faktum, value) : saveFaktum(value);
  }

  function saveFaktum(value: number) {
    console.log("Todo: Save eget gaardsbruk int");
  }

  return (
    <Dropdown
      label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
      onChange={handleOnSelect}
      options={years}
      currentValue={currentAnswer?.toString() || ""}
      placeHolderText={"Velg et år"}
    />
  );
}
