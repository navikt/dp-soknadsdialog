import { Answer, AnswerValue } from "./store/answers.slice";
import { GeneratorState } from "./store/generator-utils";
import { isGeneratorFaktum, isValgFaktum } from "./types/type-guards";
import { QuizFaktum, QuizGeneratorFaktum } from "./types/quiz.types";

export const ARBEIDSFORHOLD_FAKTUM_ID = "faktum.arbeidsforhold";
export const BARN_LISTE_FAKTUM_ID = "faktum.barn-liste";

export function getAnswerValuesByFaktumType(
  answers: Answer[],
  faktumTypes: string[]
): AnswerValue[] {
  return answers
    .flatMap((answer) => {
      if (faktumTypes.includes(answer.type)) {
        return answer.value;
      }
    })
    .filter(Boolean);
}

export function isFaktumAnswered(
  faktum: QuizFaktum,
  answers: Answer[],
  generators: GeneratorState[]
): boolean {
  // const answerIds = answers.map((a) => a.textId);
  //
  // if (answerIds.includes(faktum.beskrivendeId)) {
  //   if (isValgFaktum(faktum)) {
  //     const faktumTypes = ["flervalg", "envalg", "boolean"];
  //     const valgFaktumAnswerValues = getAnswerValuesByFaktumType(answers, faktumTypes);
  //
  //     const triggeredSubFakta = faktum.subFakta?.filter((subFaktum) =>
  //       subFaktum.requiredAnswerIds.some((id) => valgFaktumAnswerValues.includes(id))
  //     );
  //
  //     const triggeredGeneratorSubFakta = triggeredSubFakta?.filter((faktum) =>
  //       isGeneratorFaktum(faktum)
  //     ) as QuizGeneratorFaktum[] | undefined;
  //
  //     const allGeneratorSubFaktaAnswered =
  //       triggeredGeneratorSubFakta?.every((faktum) =>
  //         isGeneratorFaktumAnswered(faktum, generators)
  //       ) ?? true;
  //
  //     const allSubFaktaAnswered = triggeredSubFakta
  //       ?.filter((faktum) => !isGeneratorFaktum(faktum))
  //       .map((faktum) => faktum.textId)
  //       .every((id) => answerIds.includes(id));
  //
  //     return (allSubFaktaAnswered && allGeneratorSubFaktaAnswered) ?? false;
  //   }
  //   return true;
  // }

  return false;
}

export function isGeneratorFaktumAnswered(
  faktum: QuizGeneratorFaktum,
  generators: GeneratorState[]
): boolean {
  const generatorStateForFaktum = generators.find(
    (generator) => generator.textId === faktum.beskrivendeId
  );
  if (!generatorStateForFaktum) {
    // Todo: Sentry-log: Why is generator-state missing on state?
    return false;
  }

  const isAnswered = generatorStateForFaktum.answers.length > 0;

  switch (generatorStateForFaktum.textId) {
    case BARN_LISTE_FAKTUM_ID:
    case ARBEIDSFORHOLD_FAKTUM_ID:
      return true;
    default:
      return isAnswered || false;
  }
}
