import React from "react";
import { IValgFaktum } from "../../types/faktum.types";
import { Faktum, FaktumProps } from "./Faktum";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { isFaktumAnswered } from "../../faktum.utils";

export function SubFaktum(props: FaktumProps<IValgFaktum> & { flervalg: boolean }) {
  const answers = useSelector((state: RootState) => props.answers || state.answers);
  const generators = useSelector((state: RootState) => state.generators);
  const currentAnswerIds = props.flervalg
    ? (answers.find((answer) => answer.textId === props.faktum.textId)?.value as
        | string[]
        | undefined)
    : (answers.find((answer) => answer.textId === props.faktum.textId)?.value as
        | string
        | undefined);

  const triggeredSubFakta = props.faktum.subFaktum?.filter((faktum) =>
    props.flervalg
      ? faktum.requiredAnswerIds.find((id) => currentAnswerIds?.includes(id))
      : faktum.requiredAnswerIds.find((id) => id === currentAnswerIds)
  );

  const fistUnansweredSubFaktumIndex =
    triggeredSubFakta?.findIndex((faktum) => !isFaktumAnswered(faktum, answers, generators)) ?? -1;

  return (
    <>
      {triggeredSubFakta?.map((faktum, index) => {
        const lastFaktumIndexToShow =
          fistUnansweredSubFaktumIndex !== -1
            ? fistUnansweredSubFaktumIndex
            : triggeredSubFakta.length;

        if (index <= lastFaktumIndexToShow) {
          return (
            <Faktum
              key={faktum.textId}
              faktum={faktum}
              onChange={props.onChange}
              answers={props.answers}
            />
          );
        }
      })}
    </>
  );
}
