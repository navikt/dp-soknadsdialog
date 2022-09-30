import api from "../api.utils";
import { QuizFaktum, QuizFaktumSvarType, IQuizGeneratorFaktum } from "../types/quiz.types";

export async function saveFaktum(
  uuid: string | string[] | undefined,
  faktum: QuizFaktum | IQuizGeneratorFaktum,
  svar: QuizFaktumSvarType | QuizFaktum[][]
) {
  const res = await fetch(api(`/soknad/${uuid}/faktum/${faktum.id}`), {
    method: "PUT",
    body: JSON.stringify({ ...faktum, svar }),
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return res.json();
}
