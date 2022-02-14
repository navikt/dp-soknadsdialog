import React, { ChangeEvent } from "react";
import { IPrimitivFaktum } from "../../types/faktum.types";
import { TextField } from "@navikt/ds-react";
import { FaktumProps } from "./Faktum";
import { useDebounce } from "../../hooks/useDebounce";
import { PortableText } from "@portabletext/react";

export function FaktumNumber(props: FaktumProps<IPrimitivFaktum>) {
  const { faktum, onChange } = props;

  const onTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(faktum.beskrivendeId, event.target.value);
  };

  const debouncedOnChange = useDebounce<ChangeEvent<HTMLInputElement>>(onTextChange, 500);

  return (
    <div>
      {faktum.description && <PortableText value={faktum.description} />}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}
      <TextField
        label={faktum.title ? faktum.title : faktum.beskrivendeId}
        size="medium"
        type="number"
        onChange={debouncedOnChange}
      />
    </div>
  );
}
