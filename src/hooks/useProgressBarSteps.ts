import { useQuiz } from "../context/quiz-context";

export function useProgressBarSteps() {
  const { soknadState } = useQuiz();
  const numberOfSoknadSections = soknadState.antallSeksjoner;
  const documentationStep = numberOfSoknadSections + 1;
  const summaryStep = documentationStep + 1;

  const totalSteps = numberOfSoknadSections + 2;

  return { totalSteps, documentationStep, summaryStep };
}
