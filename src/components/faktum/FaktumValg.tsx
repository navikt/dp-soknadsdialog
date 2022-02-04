import React, { useState } from "react";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { Faktum, FaktumProps } from "./Faktum";
import { IValgFaktum } from "../../types/faktum.types";
import styles from "./Faktum.module.css";

export function FaktumValg(props: FaktumProps<IValgFaktum>) {
  const [faktumAnswer, setFaktumAnswer] = useState("");
  const { faktum, onChange } = props;

  function onSelection(value: string) {
    // TODO: Erstatte useState faktumAnswer med answer fra redux-state
    setFaktumAnswer(value);
    onChange(faktum.id, value);
  }

  return (
    <div>
      {faktum.description && <p>{faktum.description}</p>}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}

      <RadioGroup legend={faktum.title ? faktum.title : faktum.id} onChange={onSelection}>
        {faktum.answerOptions.map((answer) => (
          <Radio key={answer.id} value={answer.id}>
            {answer.title ? answer.title : answer.id}
          </Radio>
        ))}
      </RadioGroup>

      {faktum.subFaktum && faktum.subFaktum.length > 0 && (
        <div className={styles["sub-faktum"]}>
          {faktum.subFaktum.map((faktum) => {
            if (faktum.requiredAnswerIds.find((a) => a.id === faktumAnswer)) {
              return <Faktum key={faktum.id} {...faktum} />;
            }
          })}
        </div>
      )}
    </div>
  );
}
