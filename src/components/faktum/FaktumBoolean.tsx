import React, { useEffect, useState } from "react";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { Faktum, IFaktum } from "./Faktum";

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
      <RadioGroup legend={""} onChange={onChange}>
        {props.answerOptions?.map((answer) => (
          <Radio key={answer._id} value={answer._id}>
            {answer.text ? answer.text : answer._id}
          </Radio>
        ))}
      </RadioGroup>

      {props.subFaktum && props.subFaktum.length > 0 && (
        <div>
          {props.subFaktum.map((faktum) => {
            console.log("subFaktum:", faktum);
            console.log("answer:", answer);
            if (faktum.requiredAnswerIds.find((a) => a._id === answer)) {
              return <Faktum key={faktum._id} {...faktum} />;
            }
          })}
        </div>
      )}
    </div>
  );
}
