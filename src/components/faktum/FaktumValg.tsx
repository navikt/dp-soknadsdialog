import React, { useState } from "react";
import { Alert, Radio, RadioGroup } from "@navikt/ds-react";
import { Faktum, FaktumProps } from "./Faktum";
import { IValgFaktum } from "../../types/faktum.types";
import styles from "./Faktum.module.css";
import { PortableText } from "@portabletext/react";

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
      {faktum.description && <PortableText value={faktum.description} />}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}

      <RadioGroup legend={faktum.title ? faktum.title : faktum.id} onChange={onSelection}>
        {faktum.answerOptions.map((answer) => (
          <div key={answer.id}>
            <Radio value={answer.id}>{answer.title ? answer.title : answer.id}</Radio>
            {answer.helpText ? <Alert variant={"info"}>{answer.helpText}</Alert> : undefined}
            {answer.alertText && faktumAnswer === answer.id ? (
              <Alert variant={"warning"}>{answer.alertText}</Alert>
            ) : undefined}
          </div>
        ))}
      </RadioGroup>

      {faktum.subFaktum && faktum.subFaktum.length > 0 && (
        <div className={styles["sub-faktum"]}>
          {faktum.subFaktum.map((faktum) => {
            if (faktum.requiredAnswerIds.find((a) => a.id === faktumAnswer)) {
              return <Faktum key={faktum.id} faktum={faktum} onChange={onChange} />;
            }
          })}
        </div>
      )}
    </div>
  );
}
