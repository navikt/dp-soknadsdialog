import { useSoknad } from "../context/soknad-context";

export function useProgressBarSteps() {
  const { quizState: soknadState } = useSoknad();
  const numberOfSoknadSections = soknadState.antallSeksjoner;
  const documentationStep = numberOfSoknadSections + 1;
  const summaryStep = documentationStep + 1;

  const totalSteps = numberOfSoknadSections + 2;

  return { totalSteps, documentationStep, summaryStep };
}
