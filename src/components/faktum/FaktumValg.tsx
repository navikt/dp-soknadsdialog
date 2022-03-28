import React from "react";
import { Alert, Radio, RadioGroup } from "@navikt/ds-react";
import { FaktumProps } from "./Faktum";
import { IValgFaktum } from "../../types/faktum.types";
import { PortableText } from "@portabletext/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { saveAnswerToQuiz } from "../../store/answers.slice";
import { SubFaktum } from "./SubFaktum";
import styles from "./Faktum.module.css";

export function FaktumValg(props: FaktumProps<IValgFaktum>) {
  const dispatch = useDispatch();
  const { faktum, onChange } = props;
  const answers = useSelector((state: RootState) => props.answers || state.answers);
  const currentAnswerId = answers.find((answer) => answer.textId === faktum.textId)?.value as
    | string
    | undefined;

  function onSelection(value: string) {
    onChange ? onChange(faktum, value) : saveFaktum(value);
  }

  function saveFaktum(value: string) {
    const mappedAnswer = faktum.type === "boolean" ? mapStringToBoolean(value) : value;

    if (mappedAnswer === undefined) {
      // TODO sentry
      // eslint-disable-next-line no-console
      console.error("ERROR");
    }

    dispatch(
      saveAnswerToQuiz({
        textId: faktum.textId,
        value: mappedAnswer,
        type: faktum.type,
        id: faktum.id,
      })
    );
  }

  return (
    <div>
      {faktum.description && <PortableText value={faktum.description} />}
      {faktum.helpText && <p>{faktum.helpText}</p>}
      {faktum.alertText && <p>{faktum.alertText}</p>}

      <RadioGroup
        legend={faktum.title ? faktum.title : faktum.textId}
        onChange={onSelection}
        value={currentAnswerId || ""}
      >
        {faktum.answerOptions.map((answer) => (
          <div key={answer.textId}>
            <Radio value={answer.textId}>{answer.title ? answer.title : answer.textId}</Radio>
            {answer.helpText ? <Alert variant={"info"}>{answer.helpText}</Alert> : undefined}
            {answer.alertText && currentAnswerId === answer.textId ? (
              <Alert variant={"warning"}>{answer.alertText}</Alert>
            ) : undefined}
          </div>
        ))}
      </RadioGroup>

      {faktum.subFaktum && faktum.subFaktum.length > 0 && (
        <div className={styles["sub-faktum"]}>
          <SubFaktum faktum={faktum} answers={answers} onChange={onChange} flervalg={false} />
        </div>
      )}
    </div>
  );
}

function mapStringToBoolean(value: string): boolean | undefined {
  if (value.match(".*.svar.ja")) {
    return true;
  }

  if (value.match(".*.svar.nei")) {
    return false;
  }

  return undefined;
}
