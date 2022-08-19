import React, { ChangeEvent, useState } from "react";
import { IFaktum } from "../Faktum";
import { Dropdown, IDropdownOption } from "../../dropdown/Dropdown";
import { IQuizNumberFaktum } from "../../../types/quiz.types";
import { useQuiz } from "../../../context/quiz-context";
import { useSanity } from "../../../context/sanity-context";

const years: IDropdownOption[] = [];
const currentYear = new Date().getUTCFullYear();

for (let i = 0; i <= 4; i++) {
  const year = `${currentYear - i}`;
  years.push({ value: year, label: year });
}

export function FaktumEgetGaardsbrukArbeidsaar(props: IFaktum<IQuizNumberFaktum>) {
  const { faktum } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const faktumTexts = useSanity().getFaktumTextById(faktum.beskrivendeId);
  const [currentAnswer, setCurrentAnswer] = useState(faktum.svar);

  function handleOnSelect(event: ChangeEvent<HTMLSelectElement>) {
    const value = parseInt(event.target.value);
    setCurrentAnswer(value);
    props.onChange ? props.onChange(faktum, value) : saveFaktum(value);
  }

  function saveFaktum(value: number) {
    saveFaktumToQuiz(faktum, value);
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
