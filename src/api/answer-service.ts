import api from "../api.utils";
import { QuizFaktum, QuizFaktumAnswerPayload, QuizFaktumAnswerType } from "../types/quiz.types";

export async function saveFaktumToQuiz(
  uuid: string,
  faktum: QuizFaktum,
  svar: QuizFaktumAnswerType
) {
  const payload = mapToQuizFaktumAnswerPayload(faktum, svar);
  const response = await fetch(api(`/soknad/${uuid}/faktum/${faktum.id}`), {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  console.log(response);
}

function mapToQuizFaktumAnswerPayload(
  faktum: QuizFaktum,
  svar: QuizFaktumAnswerType
): QuizFaktumAnswerPayload {
  const { id, beskrivendeId, type } = faktum;
  return { id, beskrivendeId, type, svar };
}
