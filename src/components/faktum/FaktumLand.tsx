import React, { ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { PortableText } from "@portabletext/react";
import { IValgFaktum } from "../../types/faktum.types";
import { FaktumProps } from "./Faktum";
import { Dropdown, DropdownOption } from "../input/dropdown/Dropdown";
import { saveAnswerToQuiz } from "../../store/answers.slice";
import countries, { getName } from "i18n-iso-countries";
import norwegianLocale from "i18n-iso-countries/langs/nb.json";

countries.registerLocale(norwegianLocale);
const alpha3CountryCodes = countries.getAlpha3Codes();

const options: DropdownOption[] = Object.keys(alpha3CountryCodes).map((alpha3code) => ({
  value: alpha3code,
  label: getName(alpha3code, "nb"),
}));

export function FaktumLand(props: FaktumProps<IValgFaktum>) {
  const dispatch = useDispatch();
  const { faktum, onChange } = props;
  const answers = useSelector((state: RootState) => props.answers || state.answers);
  const currentAnswer = answers.find((answer) => answer.textId === faktum.textId)?.value as
    | string
    | undefined;

  useEffect(() => {
    // Set Norge as default answer on render
    if (!currentAnswer) {
      onChange ? onChange(faktum, "NOR") : saveFaktum("NOR");
    }
  }, []);

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
      {faktum.alertText && <p>{faktum.alertText}</p>}

      <Dropdown
        label={faktum.title ? faktum.title : faktum.textId}
        onChange={onSelect}
        options={options}
        currentValue={currentAnswer || "NOR"}
        placeHolderText={"Velg et land"}
      />
    </div>
  );
}
