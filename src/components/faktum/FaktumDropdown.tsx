import React, { ChangeEvent } from "react";
import { IValgFaktum } from "../../types/faktum.types";
import { Select } from "@navikt/ds-react";
import { FaktumProps } from "./Faktum";

export function FaktumDropdown(props: FaktumProps<IValgFaktum>) {
  const { faktum, onChange } = props;

  const onSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(faktum.id, event.target.value);
  };

  return (
    <div>
      {faktum.description && <p>{faktum.description}</p>}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}
      <Select label={faktum.title ? faktum.title : faktum.id} size="medium" onChange={onSelect}>
        <option value="">Velg land eller noe annen placeholder tekst</option>
        {faktum.answerOptions.map((answer) => (
          <option key={answer.id} value={answer.id}>
            {answer.title ? answer.title : answer.id}
          </option>
        ))}
      </Select>
    </div>
  );
}
