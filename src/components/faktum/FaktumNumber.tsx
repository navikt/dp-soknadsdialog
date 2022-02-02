import React from "react";
import { IPrimitivFaktum } from "../../types/faktum.types";
import { TextField } from "@navikt/ds-react";

export function FaktumNumber(props: IPrimitivFaktum) {
  return (
    <div>
      <TextField label="" size="medium" type="number" />
    </div>
  );
}
