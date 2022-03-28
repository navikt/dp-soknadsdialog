import React from "react";
import { Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { IValgFaktum } from "../../types/faktum.types";
import { FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { saveAnswerToQuiz } from "../../store/answers.slice";
import styles from "./Faktum.module.css";
import { SubFaktum } from "./SubFaktum";

export function FaktumFlervalg(props: FaktumProps<IValgFaktum>) {
  const dispatch = useDispatch();
  const { faktum, onChange } = props;
  const answers = useSelector((state: RootState) => props.answers || state.answers);
  const currentAnswerIds = answers.find((answer) => answer.textId === faktum.textId)?.value as
    | string[]
    | undefined;

  function onSelection(value: string[]) {
    onChange ? onChange(faktum, value) : saveFaktum(value);
  }

  function saveFaktum(value: string[]) {
    dispatch(
      saveAnswerToQuiz({
        textId: faktum.textId,
        value: value,
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

      <CheckboxGroup
        legend={faktum.title ? faktum.title : faktum.textId}
        onChange={onSelection}
        value={currentAnswerIds || []}
      >
        {faktum.answerOptions.map((answer) => (
          <Checkbox key={answer.textId} value={answer.textId}>
            {answer.title ? answer.title : answer.textId}
          </Checkbox>
        ))}
      </CheckboxGroup>

      {faktum.subFaktum && faktum.subFaktum.length > 0 && (
        <div className={styles["sub-faktum"]}>
          <SubFaktum faktum={faktum} answers={answers} onChange={onChange} flervalg={true} />
        </div>
      )}
    </div>
  );
}
