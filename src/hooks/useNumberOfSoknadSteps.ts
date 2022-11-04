import { useQuiz } from "../context/quiz-context";

export function useNumberOfSoknadSteps() {
  const { soknadState } = useQuiz();
  const numberOfSoknadSteps = soknadState.antallSeksjoner + 2; // Alle seksjoner + dokumentasjon + oppsummering

  return { numberOfSoknadSteps };
}
