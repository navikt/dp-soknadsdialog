import React from "react";
import { Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { IValgFaktum } from "../../types/faktum.types";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";

export function FaktumFlervalg(props: FaktumProps<IValgFaktum>) {
  const { faktum, onChange } = props;

  const onSelection = (value: string[]) => {
    onChange && onChange(faktum.beskrivendeId, value);
  };

  return (
    <div>
      {faktum.description && <PortableText value={faktum.description} />}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}

      <CheckboxGroup
        legend={faktum.title ? faktum.title : faktum.beskrivendeId}
        onChange={onSelection}
      >
        {faktum.answerOptions.map((answer) => (
          <Checkbox key={answer.beskrivendeId} value={answer.beskrivendeId}>
            {answer.title ? answer.title : answer.beskrivendeId}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </div>
  );
}
