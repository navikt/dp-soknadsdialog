import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementSectionFaktumIndex,
  incrementSectionFaktumIndex,
} from "../../store/navigation.slice";
import { Faktum } from "./Faktum";
import { Answer, AnswerValue } from "../../store/answers.slice";
import { IFaktum } from "../../types/faktum.types";
import { RootState } from "../../store";
import { isGeneratorFaktum, isValgFaktum } from "../../sanity/type-guards";
import { isEmpty, isEqual, xorWith } from "lodash";
import { usePrevious } from "../../hooks/usePrevious";

export interface FaktumProps<P> {
  faktum: P;
  answers?: Answer[];
  onChange?: (faktum: IFaktum, value: AnswerValue) => void;
}

export function SectionFaktum(props: FaktumProps<IFaktum>) {
  const dispatch = useDispatch();
  const [nextFaktumVisible, setNextFaktumVisible] = useState(false);
  const answers = useSelector((state: RootState) => state.answers);
  const prevAnswers = usePrevious(answers) ?? answers;

  useEffect(() => {
    const answerIds = answers.map((a) => a.textId);

    if (answerIds.includes(props.faktum.textId) && !isArrayEqual(answers, prevAnswers)) {
      if (isValgFaktum(props.faktum)) {
        const types = ["flervalg", "envalg", "boolean"];
        const valgFaktumAnswerValues = answers
          .flatMap((answer) => {
            if (types.includes(answer.type)) {
              return answer.value;
            }
          })
          .filter(Boolean);

        const triggeredSubFaktumIds = props.faktum.subFaktum
          ?.filter((subFaktum) =>
            subFaktum.requiredAnswerIds.some((id) => valgFaktumAnswerValues.includes(id))
          )
          .map((subFaktum) => subFaktum.textId);

        const allSubFaktaAnswered = triggeredSubFaktumIds?.every((id) => answerIds.includes(id));

        if (allSubFaktaAnswered && !nextFaktumVisible) {
          setNextFaktumVisible(true);
          dispatch(incrementSectionFaktumIndex());
        } else if (!allSubFaktaAnswered && nextFaktumVisible) {
          setNextFaktumVisible(false);
          dispatch(decrementSectionFaktumIndex());
        }
      } else {
        dispatch(incrementSectionFaktumIndex());
      }
    }

    if (isGeneratorFaktum(props.faktum) && !nextFaktumVisible) {
      setNextFaktumVisible(true);
      dispatch(incrementSectionFaktumIndex());
    }
  }, [answers]);

  return <Faktum faktum={props.faktum} />;
}

export function isArrayEqual(x: unknown[], y: unknown[]) {
  return isEmpty(xorWith(x, y, isEqual));
}
