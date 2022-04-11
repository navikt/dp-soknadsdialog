import { PortableText } from "@portabletext/react";
import React, { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCountryDropdownOptionsForFaktum } from "../../country.utils";
import { RootState } from "../../store";
import { saveAnswerToQuiz } from "../../store/answers.slice";
import { ILandFaktum } from "../../types/faktum.types";
import { Dropdown } from "../input/dropdown/Dropdown";
import { FaktumProps } from "./Faktum";

export function FaktumLand(props: FaktumProps<ILandFaktum>) {
  const dispatch = useDispatch();
  const { faktum, onChange } = props;
  const answers = useSelector((state: RootState) => props.answers || state.answers);
  const currentAnswer = answers.find((answer) => answer.textId === faktum.textId)?.value as
    | string
    | undefined;

  const options = getCountryDropdownOptionsForFaktum(props.faktum.textId);

  function onSelect(event: ChangeEvent<HTMLSelectElement>) {
    onChange ? onChange(faktum, event.target.value) : saveFaktum(event.target.value);
  }

  function saveFaktum(value: string) {
    dispatch(
      saveAnswerToQuiz({
        textId: faktum.textId,
        value: value,
        type: faktum.type,
        id: faktum.id,
      })
    );
  }

  return (
    <div>
      {faktum.description && <PortableText value={faktum.description} />}
      {faktum.helpText && <p>{faktum.helpText}</p>}

      <Dropdown
        label={faktum.title ? faktum.title : faktum.textId}
        onChange={onSelect}
        options={options}
        currentValue={currentAnswer || "Velg et land"}
        placeHolderText={"Velg et land"}
      />
    </div>
  );
}
