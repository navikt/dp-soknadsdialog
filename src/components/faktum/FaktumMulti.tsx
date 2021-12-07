import { Checkbox, CheckboxGroup } from "@navikt/ds-react";
import React, { useEffect, useState } from "react";
import { IFaktum } from "./Faktum";

export function FaktumMulti(props: IFaktum) {
  const [answer, setAnswer] = useState<string[]>([]);

  useEffect(() => {
    console.log("Ny verdi: ", answer);
  }, [answer]);

  function onChange(value: string[]) {
    setAnswer(value);
  }

  return (
    <div>
      <CheckboxGroup legend={props.title.value} onChange={onChange}>
        {props.answers.map((answer) => (
          <Checkbox key={answer._id} value={answer._id}>
            {answer.text.value}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </div>
  );
}
