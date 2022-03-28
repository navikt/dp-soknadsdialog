import { Answer, AnswerValue } from "./store/answers.slice";
import { FaktumType } from "./types/faktum.types";

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
