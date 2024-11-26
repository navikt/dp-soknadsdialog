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

export interface ISoknadContext {
  quizState: IQuizState;
  saveFaktumToQuiz: (faktum: QuizFaktum, svar: QuizFaktumSvarType) => void;
  saveGeneratorFaktumToQuiz: (faktum: IQuizGeneratorFaktum, svar: QuizFaktum[][] | null) => void;
  isLoading: boolean;
  isError: boolean;
  isLocked: boolean;
}

interface IProps {
  initialState: IQuizState;
}

export const SoknadContext = createContext<ISoknadContext | undefined>(undefined);

function SoknadProvider(props: PropsWithChildren<IProps>) {
  const { uuid } = useUuid();
  const [quizState, setQuizState] = useState<IQuizState>(props.initialState);
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
      setQuizState(response);
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
      setQuizState(response);
    }
  }

  return (
    <SoknadContext.Provider
      value={{
        quizState,
        saveFaktumToQuiz,
        saveGeneratorFaktumToQuiz,
        isLoading: saveFaktumStatus === "pending",
        isError: saveFaktumStatus === "error",
        isLocked,
      }}
    >
      {props.children}
    </SoknadContext.Provider>
  );
}

function useSoknad() {
  const context = React.useContext(SoknadContext);
  if (context === undefined) {
    throw new Error("useSoknad must be used within a SoknadProvider");
  }
  return context;
}

export { SoknadProvider, useSoknad };
