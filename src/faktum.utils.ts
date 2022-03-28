import { Answer, AnswerValue } from "./store/answers.slice";
import { FaktumType, IFaktum, IGeneratorFaktum } from "./types/faktum.types";
import { isEmpty, isEqual, xorWith } from "lodash";
import { GeneratorState } from "./store/generator-utils";
import { isGeneratorFaktum, isValgFaktum } from "./sanity/type-guards";

export function getAnswerValuesByFaktumType(
  answers: Answer[],
  faktumTypes: FaktumType[]
): AnswerValue[] {
  return answers
    .flatMap((answer) => {
      if (faktumTypes.includes(answer.type)) {
        return answer.value;
      }
    })
    .filter(Boolean);
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
      const faktumTypes: FaktumType[] = ["flervalg", "envalg", "boolean"];
      const valgFaktumAnswerValues = getAnswerValuesByFaktumType(answers, faktumTypes);

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
