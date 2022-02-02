import React from "react";
import { IPrimitivFaktum } from "../../types/faktum.types";
import { TextField } from "@navikt/ds-react";

export function FaktumNumber(props: IPrimitivFaktum) {
  return (
    <div>
      {props.description && <p>{props.description}</p>}
      {props.helpText && <p>{props.helpText}</p>}
      {props.alertText && <p>{props.alertText}</p>}
      <TextField label={props.title ? props.title : props.id} size="medium" type="number" />
    </div>
  );
}
