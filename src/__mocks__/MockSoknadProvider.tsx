import React from "react";
import { SoknadContext } from "../context/soknad-context";
import { IQuizState } from "../types/quiz.types";

interface IProps {
  children: React.ReactElement;
  initialState: IQuizState;
}

export const mockSaveFaktumToQuiz = vi.fn();
export const mockSaveGeneratorFaktumToQuiz = vi.fn();

export function MockSoknadProvider({ initialState, children }: IProps) {
  mockSaveFaktumToQuiz.mockReset();
  mockSaveGeneratorFaktumToQuiz.mockReset();

  return (
    <SoknadContext.Provider
      value={{
        quizState: initialState,
        saveFaktumToQuiz: mockSaveFaktumToQuiz,
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
