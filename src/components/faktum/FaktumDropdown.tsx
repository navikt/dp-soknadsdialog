import React from "react";
import { IValgFaktum } from "../../types/faktum.types";
import { Select } from "@navikt/ds-react";

export function FaktumDropdown(props: IValgFaktum) {
  return (
    <div>
      <Select label="" size="medium">
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
