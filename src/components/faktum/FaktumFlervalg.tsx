import React from "react";
import { Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { IValgFaktum } from "../../types/faktum.types";
import { Faktum, FaktumProps } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { saveAnswerToQuiz } from "../../store/answers.slice";
import { incrementSectionFaktumIndex } from "../../store/navigation.slice";
import styles from "./Faktum.module.css";

export function FaktumFlervalg(props: FaktumProps<IValgFaktum>) {
  const dispatch = useDispatch();
  const { faktum, onChange } = props;
  const answers = useSelector((state: RootState) => props.answers || state.answers);
  const currentAnswerIds = answers.find((answer) => answer.textId === faktum.textId)?.value as
    | string[]
    | undefined;

  const onSelection = (value: string[]) => {
    onChange ? onChange(faktum, value) : saveFaktum(value);
  };

  function saveFaktum(value: string[]) {
    dispatch(
      saveAnswerToQuiz({
        textId: faktum.textId,
        value: value,
        type: faktum.type,
        id: faktum.id,
      })
    );

    let isLeafNode = true;
    faktum?.subFaktum?.forEach((faktum) => {
      isLeafNode = faktum.requiredAnswerIds.find((a) => value.includes(a.textId))
        ? false
        : isLeafNode;
    });

    if (isLeafNode && !currentAnswerIds) {
      dispatch(incrementSectionFaktumIndex());
    }
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
          {faktum.subFaktum.map((faktum) => {
            if (faktum.requiredAnswerIds.find((a) => currentAnswerIds?.includes(a.textId))) {
              return (
                <Faktum
                  key={faktum.textId}
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
