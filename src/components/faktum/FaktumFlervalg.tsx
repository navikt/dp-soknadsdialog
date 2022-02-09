import React from "react";
import { Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { IValgFaktum } from "../../types/faktum.types";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";

export function FaktumFlervalg(props: FaktumProps<IValgFaktum>) {
  const { faktum, onChange } = props;

  const onSelection = (value: string[]) => {
    onChange(faktum.id, value);
  };

  return (
    <div>
      {faktum.description && <PortableText value={faktum.description} />}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}

      <CheckboxGroup legend={faktum.title ? faktum.title : faktum.id} onChange={onSelection}>
        {faktum.answerOptions.map((answer) => (
          <Checkbox key={answer.id} value={answer.id}>
            {answer.title ? answer.title : answer.id}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </div>
  );
}
