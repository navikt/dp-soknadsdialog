import { useState } from "react";
import { QuizFaktum } from "../types/quiz.types";

interface GeneratorState {
  activeIndex: number | undefined;
  isNewList: boolean;
  resetState: () => void;
  toggleActiveList: (index: number) => void;
  addNewList: (index: number) => void;
  saveList: (answers: QuizFaktum[], textId: string) => void;
  deleteList: (textId: string) => void;
}

export function useGeneratorState(): GeneratorState {
  const [isNewList, setIsNewList] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | undefined>();

  function handleAddNewList(index: number) {
    setActiveIndex(index);
    setIsNewList(true);
  }

  function toggleActiveList(index: number) {
    setIsNewList(false);

    if (index === activeIndex) {
      setActiveIndex(undefined);
    } else {
      setActiveIndex(index);
    }
  }

  function resetState() {
    setIsNewList(false);
    setActiveIndex(undefined);
  }

  function saveList(answers: QuizFaktum[], textId: string) {
    if (activeIndex === undefined) {
      // TODO sentry
      // eslint-disable-next-line no-console
      console.error("prøver å lagre arbeidsforhold uten av active index er satt");
      return;
    }

    // eslint-disable-next-line no-console
    console.log("save list: ", answers, textId);

    resetState();
  }

  function deleteList(textId: string) {
    if (activeIndex === undefined) {
      // TODO sentry
      // eslint-disable-next-line no-console
      console.error("prøver å lagre arbeidsforhold uten av active index er satt");
      return;
    }

    // eslint-disable-next-line no-console
    console.log("slett liste: ", textId);
    resetState();
  }

  return {
    isNewList,
    activeIndex,
    addNewList: handleAddNewList,
    toggleActiveList,
    resetState,
    saveList,
    deleteList,
  };
}
