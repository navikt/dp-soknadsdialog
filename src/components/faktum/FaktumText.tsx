import React, { ChangeEvent } from "react";
import { IPrimitivFaktum } from "../../types/faktum.types";
import { TextField } from "@navikt/ds-react";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export function FaktumText(props: FaktumProps<IPrimitivFaktum>) {
  const { faktum, onChange } = props;
  const answers = useSelector((state: RootState) => props.answers || state.answers);
  const currentAnswer =
    (answers.find((answer) => answer.faktumId === faktum.beskrivendeId)?.answer as string) ?? "";

  function onTextChange(event: ChangeEvent<HTMLInputElement>) {
    if (onChange) onChange(faktum.beskrivendeId, event.currentTarget.value);
  }

  return (
    <div>
      {faktum.description && <PortableText value={faktum.description} />}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}
      <TextField
        label={faktum.title ? faktum.title : faktum.beskrivendeId}
        size="medium"
        type="text"
        onChange={onTextChange}
        value={currentAnswer}
      />
    </div>
  );
}
