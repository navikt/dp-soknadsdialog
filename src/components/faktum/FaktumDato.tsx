import React from "react";
import { IPrimitivFaktum } from "../../types/faktum.types";
import { DatePicker } from "../input/DatePicker";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export function FaktumDato(props: FaktumProps<IPrimitivFaktum>) {
  const { faktum, onChange } = props;
  const answers = useSelector((state: RootState) => props.answers || state.answers);
  const currentAnswer =
    (answers.find((answer) => answer.faktumId === faktum.beskrivendeId)?.answer as string) ??
    new Date().toISOString();

  const onDateSelection = (value: string) => {
    onChange && onChange(faktum.beskrivendeId, value);
  };

  return (
    <div>
      {faktum.description && <PortableText value={faktum.description} />}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}
      <DatePicker
        label={faktum.title ? faktum.title : faktum.beskrivendeId}
        onChange={onDateSelection}
        value={currentAnswer}
      />
    </div>
  );
}
