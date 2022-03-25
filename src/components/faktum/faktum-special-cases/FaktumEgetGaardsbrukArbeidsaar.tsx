import React, { ChangeEvent } from "react";
import { IFaktum } from "../../../types/faktum.types";
import { FaktumProps } from "../Faktum";
import { Dropdown, DropdownOption } from "../../input/dropdown/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { saveAnswerToQuiz } from "../../../store/answers.slice";

const years: DropdownOption[] = [];
const currentYear = new Date().getUTCFullYear();

for (let i = 0; i <= 5; i++) {
  const year = `${currentYear - i}`;
  years.push({ value: year, label: year });
}

export function FaktumEgetGaardsbrukArbeidsaar(props: FaktumProps<IFaktum>) {
  const dispatch = useDispatch();
  const answers = useSelector((state: RootState) => props.answers || state.answers);
  const currentAnswer = answers.find((answer) => answer.textId === props.faktum.textId)?.value as
    | number
    | undefined;

  function handleOnSelect(event: ChangeEvent<HTMLSelectElement>) {
    const value = parseInt(event.target.value);
    props.onChange ? props.onChange(props.faktum, value) : saveFaktum(value);
  }

  function saveFaktum(value: number) {
    dispatch(
      saveAnswerToQuiz({
        textId: props.faktum.textId,
        value: value,
        type: props.faktum.type,
        id: props.faktum.id,
      })
    );
  }

  return (
    <Dropdown
      label={props.faktum.title ? props.faktum.title : props.faktum.textId}
      onChange={handleOnSelect}
      options={years}
      currentValue={currentAnswer?.toString() || ""}
      placeHolderText={"Velg et år"}
    />
  );
}
