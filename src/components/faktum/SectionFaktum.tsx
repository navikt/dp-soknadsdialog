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
    // @ts-ignore
    if (isValgFaktum(props.faktum) && answers.length !== prevAnswers?.length) {
      // @ts-ignore
      const types = ["flervalg", "envalg", "boolean"];
      const answerIds = answers.map((a) => a.textId);
      const valgFaktumAnswerIds = answers
        .flatMap((answer) => {
          if (types.includes(answer.type)) {
            return answer.value;
          }
        })
        .filter(Boolean);

      const triggeredSubfaktumIds = props.faktum.subFaktum
        ?.filter((subFaktum) => {
          const subFaktumRequiredAnswerIds = subFaktum.requiredAnswerIds.map((id) => id.textId);
          return subFaktumRequiredAnswerIds.some((id) => valgFaktumAnswerIds.includes(id));
        })
        .map((sub) => sub.textId);

      const allSubFaktaAnswered = triggeredSubfaktumIds?.every((id) => answerIds.includes(id));

      if (answerIds.includes(props.faktum.textId) && allSubFaktaAnswered) {
        dispatch(incrementSectionFaktumIndex());
      }
    }
  }, [answers]);

  return <Faktum faktum={props.faktum} />;
}
