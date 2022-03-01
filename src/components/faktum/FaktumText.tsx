import React, { useEffect, useState } from "react";
import { IPrimitivFaktum } from "../../types/faktum.types";
import { TextField } from "@navikt/ds-react";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";

export function FaktumText(props: FaktumProps<IPrimitivFaktum>) {
  const { faktum, onChange } = props;
  const answers = useSelector((state: RootState) => props.answers || state.answers);
  const currentAnswer =
    (answers.find((answer) => answer.beskrivendeId === faktum.beskrivendeId)?.answer as string) ??
    "";

  const [text, setText] = useState(currentAnswer);
  const debouncedChange = useDebouncedCallback(setText, 500);

  useEffect(() => {
    onChange && onChange(faktum, text);
  }, [text]);

  return (
    <div>
      {faktum.description && <PortableText value={faktum.description} />}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}
      <TextField
        defaultValue={currentAnswer}
        label={faktum.title ? faktum.title : faktum.beskrivendeId}
        size="medium"
        type="text"
        onChange={(event) => debouncedChange(event.currentTarget.value)}
        onBlur={debouncedChange.flush}
      />
    </div>
  );
}
