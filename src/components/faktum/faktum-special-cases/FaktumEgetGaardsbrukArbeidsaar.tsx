import React, { ChangeEvent } from "react";
import { IFaktum } from "../../../types/faktum.types";
import { FaktumProps } from "../Faktum";
import { Dropdown, DropdownOption } from "../../input/dropdown/Dropdown";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const years: DropdownOption[] = [];
const currentYear = new Date().getUTCFullYear();

for (let i = 0; i <= 5; i++) {
  const year = `${currentYear - i}`;
  years.push({ value: year, label: year });
}

export function FaktumEgetGaardsbrukArbeidsaar(props: FaktumProps<IFaktum>) {
  const answers = useSelector((state: RootState) => props.answers || state.answers);
  const currentAnswer =
    (answers.find((answer) => answer.textId === props.faktum.textId)?.value as number) ?? 0;

  function handleOnSelect(event: ChangeEvent<HTMLSelectElement>) {
    const value = parseInt(event.target.value);
    props.onChange && props.onChange(props.faktum, value);
  }

  return (
    <Dropdown
      label={props.faktum.title ? props.faktum.title : props.faktum.textId}
      onChange={handleOnSelect}
      options={years}
      currentValue={currentAnswer.toString()}
      placeHolderText={"Velg et år"}
    />
  );
}
