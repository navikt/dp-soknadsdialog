import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { incrementSectionFaktumIndex } from "../../store/navigation.slice";
import { Faktum } from "./Faktum";
import { Answer, AnswerValue } from "../../store/answers.slice";
import { IFaktum } from "../../types/faktum.types";
import { RootState } from "../../store";
import { isValgFaktum } from "../../sanity/type-guards";
import { usePrevious } from "../../hooks/usePrevious";

export interface FaktumProps<P> {
  faktum: P;
  answers?: Answer[];
  onChange?: (faktum: IFaktum, value: AnswerValue) => void;
}

export function SectionFaktum(props: FaktumProps<IFaktum>) {
  const dispatch = useDispatch();
  const answers = useSelector((state: RootState) => state.answers);
  const prevAnswers = usePrevious(answers);

  useEffect(() => {
    const answerIds = answers.map((a) => a.textId);

    if (answerIds.includes(props.faktum.textId)) {
      // @ts-ignore
      if (isValgFaktum(props.faktum) && answers.length !== prevAnswers?.length) {
        const types = ["flervalg", "envalg", "boolean"];
        const valgFaktumAnswerValues = answers
          .flatMap((answer) => {
            if (types.includes(answer.type)) {
              return answer.value;
            }
          })
          .filter(Boolean);

        const triggeredSubfaktumIds = props.faktum.subFaktum
          ?.filter((subFaktum) =>
            subFaktum.requiredAnswerIds.some((id) => valgFaktumAnswerValues.includes(id))
          )
          .map((subFaktum) => subFaktum.textId);

        const allSubFaktaAnswered = triggeredSubfaktumIds?.every((id) => answerIds.includes(id));

        if (allSubFaktaAnswered) {
          dispatch(incrementSectionFaktumIndex());
        }
      } else {
        dispatch(incrementSectionFaktumIndex());
      }
    }
  }, [answers]);

  return <Faktum faktum={props.faktum} />;
}
