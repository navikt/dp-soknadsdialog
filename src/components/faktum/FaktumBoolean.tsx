import React, { useEffect, useState } from "react";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { Faktum, FaktumAnswer, IFaktum } from "./Faktum";

export function FaktumBoolean(props: IFaktum) {
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    console.log("Ny verdi: ", answer);
  }, [answer]);

  function onChange(value: string) {
    setAnswer(value);
  }

  return (
    <div>
      <RadioGroup legend={props.title.value} onChange={onChange}>
        {props.answers.map((answer) => (
          <Radio key={answer._id} value={answer._id}>
            {answer.text.value}
          </Radio>
        ))}
      </RadioGroup>

      {props.subFaktum && props.subFaktum.length > 0 && (
        <div>
          {props.subFaktum.map((faktum) => {
            if (faktum.requiredAnswerId === answer) {
              return <Faktum key={faktum._id} {...faktum} />;
            }
          })}
        </div>
      )}
    </div>
  );
}
