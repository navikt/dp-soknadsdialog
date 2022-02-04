import React, { useEffect, useState } from "react";
import { Alert, Radio, RadioGroup } from "@navikt/ds-react";
import { Faktum } from "./Faktum";
import { IValgFaktum } from "../../types/faktum.types";
import styles from "./Faktum.module.css";

export function FaktumValg(props: IValgFaktum) {
  const [answerState, setAnswerState] = useState("");

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("Ny verdi: ", answerState);
  }, [answerState]);

  function onChange(value: string) {
    setAnswerState(value);
  }

  return (
    <div>
      {props.description && <p>{props.description}</p>}
      {props.helpText && <p>{props.helpText}</p>}
      {props.alertText && <p>{props.alertText}</p>}

      <RadioGroup legend={props.title ? props.title : props.id} onChange={onChange}>
        {props.answerOptions.map((answer) => (
          <>
            <Radio key={answer.id} value={answer.id}>
              {answer.title ? answer.title : answer.id}
            </Radio>
            {answer.helpText ? <Alert variant={"info"}>{answer.helpText}</Alert> : undefined}
            {answer.alertText && answerState === answer.id ? (
              <Alert variant={"warning"}>{answer.alertText}</Alert>
            ) : undefined}
          </>
        ))}
      </RadioGroup>

      {props.subFaktum && props.subFaktum.length > 0 && (
        <div className={styles["sub-faktum"]}>
          {props.subFaktum.map((faktum) => {
            if (faktum.requiredAnswerIds.find((a) => a.id === answerState)) {
              return <Faktum key={faktum.id} {...faktum} />;
            }
          })}
        </div>
      )}
    </div>
  );
}
