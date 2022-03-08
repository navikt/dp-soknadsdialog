import { useState } from "react";
import { Answer } from "../store/answers.slice";
import { deleteGeneratorFromQuiz, saveGeneratorStateToQuiz } from "../store/generators.slice";
import { useDispatch } from "react-redux";

interface GeneratorState {
  activeIndex: number | undefined;
  isNewList: boolean;
  resetState: () => void;
  toggleActiveList: (index: number) => void;
  addNewList: (index: number) => void;
  saveList: (answers: Answer[], textId: string) => void;
  deleteList: (textId: string) => void;
}

export function useGeneratorState(): GeneratorState {
  const dispatch = useDispatch();
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

  function saveList(answers: Answer[], textId: string) {
    if (activeIndex === undefined) {
      // TODO sentry
      // eslint-disable-next-line no-console
      console.error("prøver å lagre arbeidsforhold uten av active index er satt");
      return;
    }

    dispatch(
      saveGeneratorStateToQuiz({
        index: activeIndex,
        textId,
        answers,
      })
    );
    resetState();
  }

  function deleteList(textId: string) {
    if (activeIndex === undefined) {
      // TODO sentry
      // eslint-disable-next-line no-console
      console.error("prøver å lagre arbeidsforhold uten av active index er satt");
      return;
    }
    dispatch(
      deleteGeneratorFromQuiz({
        index: activeIndex,
        textId,
      })
    );
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
