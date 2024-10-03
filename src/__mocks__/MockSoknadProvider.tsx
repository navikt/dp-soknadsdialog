import React from "react";
import { SoknadContext } from "../context/soknad-context";
import { IQuizState } from "../types/quiz.types";
import { IOrkestratorState } from "../types/orkestrator.types";

interface IProps {
  children: React.ReactElement;
  quizState: IQuizState;
  orkestratorState: IOrkestratorState;
}

export const mockSaveFaktumToQuiz = vi.fn();
export const mockSaveAnswerToOrkestrator = vi.fn();
export const mockSaveGeneratorFaktumToQuiz = vi.fn();

export function MockQuizProvider({ quizState, orkestratorState, children }: IProps) {
  mockSaveFaktumToQuiz.mockReset();
  mockSaveGeneratorFaktumToQuiz.mockReset();

  return (
    <SoknadContext.Provider
      value={{
        quizState,
        orkestratorState,
        saveFaktumToQuiz: mockSaveFaktumToQuiz,
        saveAnswerToOrkestrator: mockSaveAnswerToOrkestrator,
        saveGeneratorFaktumToQuiz: mockSaveGeneratorFaktumToQuiz,
        isLoading: false,
        isError: false,
        isLocked: false,
      }}
    >
      {children}
    </SoknadContext.Provider>
  );
}