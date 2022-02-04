import React, { ChangeEvent } from "react";
import { IPrimitivFaktum } from "../../types/faktum.types";
import { TextField } from "@navikt/ds-react";
import { FaktumProps } from "./Faktum";
import { useDebounce } from "../../hooks/useDebounce";

export function FaktumText(props: FaktumProps<IPrimitivFaktum>) {
  const { faktum, onChange } = props;

  const onTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(faktum.id, event.target.value);
  };

  const debouncedOnChange = useDebounce<ChangeEvent<HTMLInputElement>>(onTextChange, 500);

  return (
    <div>
      {faktum.description && <p>{faktum.description}</p>}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}
      <TextField
        label={faktum.title ? faktum.title : faktum.id}
        size="medium"
        type="text"
        onChange={debouncedOnChange}
      />
    </div>
  );
}
