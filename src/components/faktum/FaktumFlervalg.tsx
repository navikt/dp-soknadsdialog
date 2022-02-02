import { Checkbox, CheckboxGroup } from "@navikt/ds-react";
import React, { useEffect, useState } from "react";
import { IValgFaktum } from "../../types/faktum.types";

export function FaktumFlervalg(props: IValgFaktum) {
  const [answer, setAnswer] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("Ny verdi: ", answer);
  }, [answer]);

  function onChange(value: string[]) {
    setAnswer(value);
  }

  return (
    <div>
      {props.description && <p>{props.description}</p>}
      {props.helpText && <p>{props.helpText}</p>}
      {props.alertText && <p>{props.alertText}</p>}

      <CheckboxGroup legend={props.title ? props.title : props.id} onChange={onChange}>
        {props.answerOptions.map((answer) => (
          <Checkbox key={answer.id} value={answer.id}>
            {answer.title ? answer.title : answer.id}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </div>
  );
}
