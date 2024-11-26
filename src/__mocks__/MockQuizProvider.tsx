import React from "react";
import { QuizContext } from "../context/quiz-context";
import { IOrkestratorSoknad } from "../types/orkestrator.types";
import { IQuizState } from "../types/quiz.types";

interface IProps {
  children: React.ReactElement;
  quizState: IQuizState;
  orkestratorState: IOrkestratorSoknad;
}

export const mockSaveFaktumToQuiz = vi.fn();
export const mockSaveOpplysningToOrkestrator = vi.fn();
export const mockSaveGeneratorFaktumToQuiz = vi.fn();

export function MockQuizProvider({ quizState, orkestratorState, children }: IProps) {
  mockSaveFaktumToQuiz.mockReset();
  mockSaveGeneratorFaktumToQuiz.mockReset();

  return (
    <QuizContext.Provider
      value={{
        soknadState: quizState,
        orkestratorState: orkestratorState,
        saveFaktumToQuiz: mockSaveFaktumToQuiz,
        saveOpplysningToOrkestrator: mockSaveOpplysningToOrkestrator,
        saveGeneratorFaktumToQuiz: mockSaveGeneratorFaktumToQuiz,
        isLoading: false,
        isError: false,
        isLocked: false,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}
