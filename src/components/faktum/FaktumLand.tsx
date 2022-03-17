import React, { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { PortableText } from "@portabletext/react";
import { IValgFaktum } from "../../types/faktum.types";
import { FaktumProps } from "./Faktum";
import { Dropdown, DropdownOption } from "../input/dropdown/Dropdown";
import { saveAnswerToQuiz } from "../../store/answers.slice";
import { setSectionFaktumIndex } from "../../store/navigation.slice";
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
  const currentSectionFaktumIndex = useSelector(
    (state: RootState) => state.navigation.sectionFaktumIndex
  );
  const currentAnswer =
    (answers.find((answer) => answer.textId === faktum.textId)?.value as string) ?? "";

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

    dispatch(setSectionFaktumIndex(currentSectionFaktumIndex + 1));
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
        currentValue={currentAnswer}
        placeHolderText={"Velg et land"}
      />
    </div>
  );
}
