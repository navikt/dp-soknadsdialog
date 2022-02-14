import React, { ChangeEvent } from "react";
import { IPrimitivFaktum } from "../../types/faktum.types";
import { TextField } from "@navikt/ds-react";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export function FaktumNumber(props: FaktumProps<IPrimitivFaktum>) {
  const { faktum, onChange } = props;
  const answers = useSelector((state: RootState) => props.answers || state.answers);
  const currentAnswer =
    (answers.find((answer) => answer.faktumId === faktum.id)?.answer as number) ?? 0;

  function onTextChange(event: ChangeEvent<HTMLInputElement>) {
    onChange && onChange(faktum.id, event.target.value);
  }

  return (
    <div>
      {faktum.description && <PortableText value={faktum.description} />}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}
      <TextField
        label={faktum.title ? faktum.title : faktum.id}
        size="medium"
        type="number"
        onChange={onTextChange}
        value={currentAnswer}
      />
    </div>
  );
}
