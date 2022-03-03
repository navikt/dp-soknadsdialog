import React, { ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { PortableText } from "@portabletext/react";
import { IValgFaktum } from "../../types/faktum.types";
import { FaktumProps } from "./Faktum";
import countries, { getName } from "i18n-iso-countries";
import norwegianLocale from "i18n-iso-countries/langs/nb.json";
import { Dropdown, DropdownOption } from "../input/dropdown/Dropdown";

countries.registerLocale(norwegianLocale);
const alpha3CountryCodes = countries.getAlpha3Codes();

const options: DropdownOption[] = Object.keys(alpha3CountryCodes).map((alpha3code) => ({
  value: alpha3code,
  label: getName(alpha3code, "nb"),
}));

export function FaktumLand(props: FaktumProps<IValgFaktum>) {
  const { faktum, onChange } = props;
  const answers = useSelector((state: RootState) => props.answers || state.answers);
  const currentAnswer =
    (answers.find((answer) => answer.beskrivendeId === faktum.beskrivendeId)?.answer as string) ??
    "";

  function onSelect(event: ChangeEvent<HTMLSelectElement>) {
    onChange && onChange(faktum, event.target.value);
  }

  return (
    <div>
      {faktum.description && <PortableText value={faktum.description} />}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}

      <Dropdown
        label={faktum.title ? faktum.title : faktum.beskrivendeId}
        onChange={onSelect}
        options={options}
        currentValue={currentAnswer}
        placeHolderText={"Velg et land"}
      />
    </div>
  );
}
