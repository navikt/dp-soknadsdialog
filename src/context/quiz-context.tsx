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
import { IOrkestratorState } from "../pages/api/common/orkestrator-api";

export interface IQuizContext {
  soknadState: IQuizState;
  orkestratorState: IOrkestratorState | null;
  saveFaktumToQuiz: (faktum: QuizFaktum, svar: QuizFaktumSvarType) => void;
  saveGeneratorFaktumToQuiz: (faktum: IQuizGeneratorFaktum, svar: QuizFaktum[][] | null) => void;
  isLoading: boolean;
  isError: boolean;
  isLocked: boolean;
}

interface IProps {
  quizState: IQuizState;
  orkestratorState?: IOrkestratorState;
}

export const QuizContext = createContext<IQuizContext | undefined>(undefined);

function QuizProvider(props: PropsWithChildren<IProps>) {
  const { uuid } = useUuid();
  const [soknadState, setSoknadState] = useState<IQuizState>(props.quizState);
  const [orkestratorState] = useState<IOrkestratorState | null>(props.orkestratorState || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [saveFaktum, saveFaktumStatus] = usePutRequest<ISaveFaktumBody, IQuizState>(
    "soknad/faktum/save",
    true,
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
    svar: QuizFaktum[][] | null,
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
        orkestratorState,
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
