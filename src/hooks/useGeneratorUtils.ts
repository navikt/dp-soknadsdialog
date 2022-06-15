import { useState } from "react";
import { QuizGeneratorFaktum } from "../types/quiz.types";
import { useQuiz } from "../context/quiz-context";

interface GeneratorUtils {
  activeIndex: number | undefined;
  toggleActiveGeneratorAnswer: (index: number) => void;
  addNewGeneratorAnswer: (faktum: QuizGeneratorFaktum) => void;
  deleteGeneratorAnswer: (faktum: QuizGeneratorFaktum, answerIndex: number) => void;
}

export function useGeneratorUtils(): GeneratorUtils {
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
  function addNewGeneratorAnswer(faktum: QuizGeneratorFaktum) {
    const existingAnswers = faktum?.svar ? faktum.svar : [];
    saveGeneratorFaktumToQuiz(faktum, [...existingAnswers, []]);
  }

  function deleteGeneratorAnswer(faktum: QuizGeneratorFaktum, answerIndex: number) {
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
