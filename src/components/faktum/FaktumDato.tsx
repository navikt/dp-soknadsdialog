import React from "react";
import { IPrimitivFaktum } from "../../types/faktum.types";
import { DatePicker } from "../input/date-picker";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { formatISO } from "date-fns";

export function FaktumDato(props: FaktumProps<IPrimitivFaktum>) {
  const { faktum, onChange } = props;
  const answers = useSelector((state: RootState) => props.answers || state.answers);
  const currentAnswer =
    (answers.find((answer) => answer.textId === faktum.textId)?.value as string) ??
    new Date().toISOString();

  const onDateSelection = (value: Date) => {
    const date = formatISO(value, { representation: "date" });
    onChange && onChange(faktum, date);
  };

  return (
    <div>
      {faktum.description && <PortableText value={faktum.description} />}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}
      <DatePicker
        label={faktum.title ? faktum.title : faktum.textId}
        onChange={onDateSelection}
        value={currentAnswer}
      />
    </div>
  );
}
