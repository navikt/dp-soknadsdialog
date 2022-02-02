import React from "react";
import { IValgFaktum } from "../../types/faktum.types";
import { Select } from "@navikt/ds-react";

export function FaktumDropdown(props: IValgFaktum) {
  return (
    <div>
      {props.description && <p>{props.description}</p>}
      {props.helpText && <p>{props.helpText}</p>}
      {props.alertText && <p>{props.alertText}</p>}
      <Select label={props.title ? props.title : props.id} size="medium">
        <option value="">Velg land eller noe annen placeholder tekst</option>
        {props.answerOptions.map((answer) => (
          <option key={answer.id} value={answer.id}>
            {answer.title ? answer.title : answer.id}
          </option>
        ))}
      </Select>
    </div>
  );
}
