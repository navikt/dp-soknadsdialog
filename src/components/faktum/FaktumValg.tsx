import React from "react";
import { Alert, Radio, RadioGroup } from "@navikt/ds-react";
import { Faktum, FaktumProps } from "./Faktum";
import { IValgFaktum } from "../../types/faktum.types";
import { PortableText } from "@portabletext/react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import styles from "./Faktum.module.css";

export function FaktumValg(props: FaktumProps<IValgFaktum>) {
  const { faktum, onChange } = props;
  const answers = useSelector((state: RootState) => props.answers || state.answers);
  const currentAnswerId =
    (answers.find((answer) => answer.faktumId === faktum.id)?.answer as string) ?? "";

  function onSelection(value: string) {
    onChange && onChange(faktum.id, value);
  }

  return (
    <div>
      {faktum.description && <PortableText value={faktum.description} />}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}

      <RadioGroup
        legend={faktum.title ? faktum.title : faktum.id}
        onChange={onSelection}
        value={currentAnswerId}
      >
        {faktum.answerOptions.map((answer) => (
          <div key={answer.id}>
            <Radio value={answer.id}>{answer.title ? answer.title : answer.id}</Radio>
            {answer.helpText ? <Alert variant={"info"}>{answer.helpText}</Alert> : undefined}
            {answer.alertText && currentAnswerId === answer.id ? (
              <Alert variant={"warning"}>{answer.alertText}</Alert>
            ) : undefined}
          </div>
        ))}
      </RadioGroup>

      {faktum.subFaktum && faktum.subFaktum.length > 0 && (
        <div className={styles["sub-faktum"]}>
          {faktum.subFaktum.map((faktum) => {
            if (faktum.requiredAnswerIds.find((a) => a.id === currentAnswerId)) {
              return (
                <Faktum
                  key={faktum.id}
                  faktum={faktum}
                  onChange={onChange}
                  answers={props.answers}
                />
              );
            }
          })}
        </div>
      )}
    </div>
  );
}
