import { useState } from "react";
import { IQuizGeneratorFaktum } from "../types/quiz.types";
import { useQuiz } from "../context/quiz-context";

interface IGeneratorUtils {
  activeIndex: number | undefined;
  toggleActiveGeneratorAnswer: (index: number) => void;
  addNewGeneratorAnswer: (faktum: IQuizGeneratorFaktum) => void;
  deleteGeneratorAnswer: (faktum: IQuizGeneratorFaktum, answerIndex: number) => void;
}

export function useGeneratorUtils(): IGeneratorUtils {
  const { saveGeneratorFaktumToQuiz } = useQuiz();
  const [activeIndex, setActiveIndex] = useState<number | undefined>();

  function toggleActiveGeneratorAnswer(index: number) {
    if (index === activeIndex) {
      setActiveIndex(undefined);
    } else {
      setActiveIndex(index);
    }
  }

  // Creating a new generator answer requires appending an empty array to generatorFaktum.svar. Quiz will handle the rest. Fingers crossed.
  function addNewGeneratorAnswer(faktum: IQuizGeneratorFaktum) {
    const existingAnswers = faktum?.svar ? faktum.svar : [];
    saveGeneratorFaktumToQuiz(faktum, [...existingAnswers, []]);
  }

  function deleteGeneratorAnswer(faktum: IQuizGeneratorFaktum, answerIndex: number) {
    const svar = faktum.svar || [];
    svar.splice(answerIndex, 1);
    saveGeneratorFaktumToQuiz(faktum, svar);
  }

  return {
    activeIndex,
    addNewGeneratorAnswer,
    deleteGeneratorAnswer,
    toggleActiveGeneratorAnswer,
  };
}
