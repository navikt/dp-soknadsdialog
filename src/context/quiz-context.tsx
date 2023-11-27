import React, { createContext, PropsWithChildren, useState } from "react";
import {
  IQuizGeneratorFaktum,
  IQuizState,
  QuizFaktum,
  QuizFaktumSvarType,
} from "../types/quiz.types";
import { ISaveFaktumBody } from "../pages/api/soknad/faktum/save";
import { usePutRequest } from "../hooks/request/usePutRequest";
import { useUuid } from "../hooks/useUuid";

export interface IQuizContext {
  soknadState: IQuizState;
  saveFaktumToQuiz: (faktum: QuizFaktum, svar: QuizFaktumSvarType) => void;
  saveGeneratorFaktumToQuiz: (faktum: IQuizGeneratorFaktum, svar: QuizFaktum[][] | null) => void;
  isLoading: boolean;
  isError: boolean;
  isLocked: boolean;
}

export const QuizContext = createContext<IQuizContext | undefined>(undefined);

interface IProps {
  initialState: IQuizState;
}

function QuizProvider(props: PropsWithChildren<IProps>) {
  const { uuid } = useUuid();
  const [soknadState, setSoknadState] = useState<IQuizState>(props.initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [saveFaktum, saveFaktumStatus] = usePutRequest<ISaveFaktumBody, IQuizState>(
    "soknad/faktum/save",
    true
  );

  async function saveFaktumToQuiz(faktum: QuizFaktum, svar: QuizFaktumSvarType) {
    if (isLoading) {
      setIsLocked(true);
      return;
    }

    setIsLoading(true);
    const response = await saveFaktum({ uuid, faktum, svar });

    if (response) {
      setSoknadState(response);
    }

    setIsLocked(false);
    setIsLoading(false);
  }

  async function saveGeneratorFaktumToQuiz(
    faktum: IQuizGeneratorFaktum,
    svar: QuizFaktum[][] | null
  ) {
    const response = await saveFaktum({ uuid, faktum, svar });
    if (response) {
      setSoknadState(response);
    }
  }

  return (
    <QuizContext.Provider
      value={{
        soknadState,
        saveFaktumToQuiz,
        saveGeneratorFaktumToQuiz,
        isLoading: saveFaktumStatus === "pending",
        isError: saveFaktumStatus === "error",
        isLocked,
      }}
    >
      {props.children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = React.useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}

export { QuizProvider, useQuiz };
