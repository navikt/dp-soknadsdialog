import api from "../api.utils";
import { QuizFaktum, QuizFaktumSvarType, IQuizGeneratorFaktum } from "../types/quiz.types";

export async function saveFaktum(
  uuid: string | string[] | undefined,
  faktum: QuizFaktum | IQuizGeneratorFaktum,
  svar: QuizFaktumSvarType | QuizFaktum[][]
) {
  const url = api(`/soknad/${uuid}/faktum/${faktum.id}`);

  const saveFaktumToQuiz = await fetch(url, {
    method: "PUT",
    body: JSON.stringify({ ...faktum, svar }),
  });

  try {
    const res = await saveFaktumToQuiz;

    if (res.ok) {
      return res.json();
    } else {
      throw Error(res.statusText);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
