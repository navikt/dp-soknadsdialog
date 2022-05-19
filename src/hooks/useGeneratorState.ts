import { useState } from "react";
import { QuizFaktum, QuizGeneratorFaktum } from "../types/quiz.types";
import { useQuiz } from "../context/quiz-context";

interface GeneratorState {
  resetState: () => void;
  deleteSkjema: () => void;
  generatorSvar: QuizFaktum[][];
  activeIndex: number | undefined;
  isNewGeneratorSkjema: boolean;
  addNewSkjema: (index: number) => void;
  toggleActiveSkjema: (index: number) => void;
  saveSkjema: (faktum: QuizGeneratorFaktum, svar: QuizFaktum[]) => void;
}

export function useGeneratorState(initialGeneratorState?: QuizFaktum[][]): GeneratorState {
  const { saveGeneratorFaktumToQuiz } = useQuiz();
  const [generatorSvar, setGeneratorSvar] = useState<QuizFaktum[][]>(initialGeneratorState || []);
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const [isNewGeneratorSkjema, setIsNewGeneratorSkjema] = useState(false);

  function addNewSkjema(index: number) {
    setActiveIndex(index);
    setIsNewGeneratorSkjema(true);
  }

  function toggleActiveSkjema(index: number) {
    setIsNewGeneratorSkjema(false);

    if (index === activeIndex) {
      setActiveIndex(undefined);
    } else {
      setActiveIndex(index);
    }
  }

  function resetState() {
    setIsNewGeneratorSkjema(false);
    setActiveIndex(undefined);
  }

  function saveSkjema(faktum: QuizGeneratorFaktum, svar: QuizFaktum[]) {
    if (activeIndex === undefined) {
      // TODO sentry
      // eslint-disable-next-line no-console
      console.error("prøver å lagre generator uten av active index er satt");
      return;
    }

    let newState;
    if (isNewGeneratorSkjema) {
      newState = [...generatorSvar, svar];
    } else {
      newState = [...generatorSvar];
      newState[activeIndex] = svar;
    }

    setGeneratorSvar(newState);
    saveGeneratorFaktumToQuiz(faktum, newState);

    resetState();
  }

  function deleteSkjema() {
    if (activeIndex === undefined) {
      // TODO sentry
      // eslint-disable-next-line no-console
      console.error("prøver å lagre arbeidsforhold uten av active index er satt");
      return;
    }

    const newState = generatorSvar;
    newState.splice(activeIndex, 1);

    setGeneratorSvar(newState);
    resetState();
  }

  return {
    activeIndex,
    resetState,
    saveSkjema,
    deleteSkjema,
    addNewSkjema,
    generatorSvar,
    toggleActiveSkjema,
    isNewGeneratorSkjema,
  };
}
