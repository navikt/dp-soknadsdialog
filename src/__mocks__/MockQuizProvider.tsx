import React from "react";
import { QuizContext } from "../context/quiz-context";
import { IQuizState } from "../types/quiz.types";

interface IProps {
  children: React.ReactElement;
  initialState: IQuizState;
}

export const mockSaveFaktumToQuiz = jest.fn();
export const mockSaveGeneratorFaktumToQuiz = jest.fn();

export function MockQuizProvider({ initialState, children }: IProps) {
  mockSaveFaktumToQuiz.mockReset();
  mockSaveGeneratorFaktumToQuiz.mockReset();

  return (
    <QuizContext.Provider
      value={{
        soknadState: initialState,
        saveFaktumToQuiz: mockSaveFaktumToQuiz,
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
