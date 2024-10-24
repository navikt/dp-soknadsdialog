import { useQuiz } from "../context/quiz-context";

export function useProgressBarSteps() {
  const { soknadState, orkestratorState } = useQuiz();
  const numberOfSoknadSections = soknadState.antallSeksjoner + (orkestratorState && orkestratorState?.antallSeksjoner || 0) ;
  const documentationStep = numberOfSoknadSections + 1;
  const summaryStep = documentationStep + 1;

  const totalSteps = numberOfSoknadSections + 2;

  return { totalSteps, documentationStep, summaryStep };
}
