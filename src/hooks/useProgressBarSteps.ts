import { useSoknad } from "../context/soknad-context";

export function useProgressBarSteps() {
  const { quizState, orkestratorState } = useSoknad();
  const numberOfSoknadSections =
    quizState.antallSeksjoner + ((orkestratorState && orkestratorState?.antallSeksjoner) || 0);
  const documentationStep = numberOfSoknadSections + 1;
  const summaryStep = documentationStep + 1;

  const totalSteps = numberOfSoknadSections + 2;

  return { totalSteps, documentationStep, summaryStep };
}
