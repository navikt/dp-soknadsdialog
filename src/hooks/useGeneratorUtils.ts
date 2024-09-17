import { useState } from "react";
import { IQuizGeneratorFaktum } from "../types/quiz.types";
import { useQuiz } from "../context/quiz-context";
import { useUserInfo } from "../context/user-info-context";

interface IGeneratorUtils {
  activeIndex: number | undefined;
  toggleActiveGeneratorAnswer: (index: number) => void;
  closeGeneratorAnswer: () => void;
  addNewGeneratorAnswer: (faktum: IQuizGeneratorFaktum) => void;
  deleteGeneratorAnswer: (faktum: IQuizGeneratorFaktum, answerIndex: number) => void;
}

export function useGeneratorUtils(): IGeneratorUtils {
  const { saveGeneratorFaktumToQuiz } = useQuiz();
  const { setContextSelectedArbeidsforhold } = useUserInfo();
  const [activeIndex, setActiveIndex] = useState<number | undefined>();

  function toggleActiveGeneratorAnswer(index: number | undefined) {
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

  function closeGeneratorAnswer() {
    setActiveIndex(undefined);
    setContextSelectedArbeidsforhold(undefined);
  }

  function deleteGeneratorAnswer(faktum: IQuizGeneratorFaktum, answerIndex: number) {
    if (faktum.svar) {
      // Save null as answer when deleting last genetor answer.
      if (faktum.svar.length === 1) {
        saveGeneratorFaktumToQuiz(faktum, null);
        toggleActiveGeneratorAnswer(undefined);
      } else {
        const svar = faktum.svar.filter((_, index) => index !== answerIndex);

        saveGeneratorFaktumToQuiz(faktum, svar);
        toggleActiveGeneratorAnswer(undefined);
      }
    }
  }

  return {
    activeIndex,
    addNewGeneratorAnswer,
    deleteGeneratorAnswer,
    toggleActiveGeneratorAnswer,
    closeGeneratorAnswer,
  };
}
