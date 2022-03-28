import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { incrementSectionFaktumIndex } from "../../store/navigation.slice";
import { Faktum } from "./Faktum";
import { Answer, AnswerValue } from "../../store/answers.slice";
import { IFaktum, IGeneratorFaktum } from "../../types/faktum.types";
import { RootState } from "../../store";
import { isGeneratorFaktum, isValgFaktum } from "../../sanity/type-guards";
import { isEmpty, isEqual, xorWith } from "lodash";
import { usePrevious } from "../../hooks/usePrevious";
import { GeneratorState } from "../../store/generator-utils";

export interface FaktumProps<P> {
  faktum: P;
  answers?: Answer[];
  onChange?: (faktum: IFaktum, value: AnswerValue) => void;
}

export function SectionFaktum(props: FaktumProps<IFaktum>) {
  const dispatch = useDispatch();
  const answers = useSelector((state: RootState) => state.answers);
  const prevAnswers = usePrevious(answers) ?? answers;
  const generators = useSelector((state: RootState) => state.generators);
  const prevGenerators = usePrevious(generators) ?? generators;

  useEffect(() => {
    if (!isArrayEqual(answers, prevAnswers) || !isArrayEqual(generators, prevGenerators)) {
      if (isFaktumAnswered(props.faktum, answers, generators)) {
        dispatch(incrementSectionFaktumIndex());
      }
    }
  }, [answers, generators]);

  return <Faktum faktum={props.faktum} />;
}

export function isArrayEqual(x: unknown[], y: unknown[]) {
  return isEmpty(xorWith(x, y, isEqual));
}

export function isFaktumAnswered(
  faktum: IFaktum,
  answers: Answer[],
  generators: GeneratorState[]
): boolean {
  const answerIds = answers.map((a) => a.textId);

  if (answerIds.includes(faktum.textId)) {
    if (isValgFaktum(faktum)) {
      const types = ["flervalg", "envalg", "boolean"];
      const valgFaktumAnswerValues = answers
        .flatMap((answer) => {
          if (types.includes(answer.type)) {
            return answer.value;
          }
        })
        .filter(Boolean);

      const triggeredSubFakta = faktum.subFaktum?.filter((subFaktum) =>
        subFaktum.requiredAnswerIds.some((id) => valgFaktumAnswerValues.includes(id))
      );

      const triggeredGeneratorSubFakta = triggeredSubFakta?.filter((faktum) =>
        isGeneratorFaktum(faktum)
      ) as IGeneratorFaktum[] | undefined;

      const allGeneratorSubFaktaAnswered =
        triggeredGeneratorSubFakta?.every((faktum) =>
          isGeneratorFaktumAnswered(faktum, generators)
        ) ?? true;

      const allSubFaktaAnswered = triggeredSubFakta
        ?.filter((faktum) => !isGeneratorFaktum(faktum))
        .map((faktum) => faktum.textId)
        .every((id) => answerIds.includes(id));

      return (allSubFaktaAnswered && allGeneratorSubFaktaAnswered) ?? false;
    }
    return true;
  }

  return false;
}

export function isGeneratorFaktumAnswered(
  faktum: IGeneratorFaktum,
  generators: GeneratorState[]
): boolean {
  const state = generators.find((generator) => generator.textId === faktum.textId);
  if (!state) {
    return false;
  }

  if (state.textId === "faktum.barn-liste") {
    return true;
  }

  const isAnswered = state.answers.length > 0;
  return isAnswered || false;
}
