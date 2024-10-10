import React, { createContext, PropsWithChildren, useState } from "react";
import { usePutRequest } from "../hooks/request/usePutRequest";
import { useUuid } from "../hooks/useUuid";
import { ISaveOrkestratorAnswerBody } from "../pages/api/orkestrator/save";
import { ISaveFaktumBody } from "../pages/api/soknad/faktum/save";
import { IOrkestratorState, OrkestratorOpplysningType } from "../types/orkestrator.types";
import {
  IQuizGeneratorFaktum,
  IQuizState,
  QuizFaktum,
  QuizFaktumSvarType,
} from "../types/quiz.types";

export interface ISoknadContext {
  quizState: IQuizState;
  orkestratorState: IOrkestratorState | null;
  saveFaktumToQuiz: (faktum: QuizFaktum, svar: QuizFaktumSvarType) => void;
  saveGeneratorFaktumToQuiz: (faktum: IQuizGeneratorFaktum, svar: QuizFaktum[][] | null) => void;
  saveOpplysningToOrkestrator: (
    opplysningId: string,
    type: OrkestratorOpplysningType,
    verdi: QuizFaktumSvarType,
  ) => void;
  isLoading: boolean;
  isError: boolean;
  isLocked: boolean;
}

interface IProps {
  quizState: IQuizState;
  orkestratorState?: IOrkestratorState;
}

export const SoknadContext = createContext<ISoknadContext | undefined>(undefined);

function SoknadProvider(props: PropsWithChildren<IProps>) {
  const { uuid } = useUuid();
  const [quizState, setQuizState] = useState<IQuizState>(props.quizState);
  const [orkestratorState, setOrkestratorState] = useState<IOrkestratorState | null>(
    props.orkestratorState || null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Quiz
  const [saveFaktum, saveFaktumStatus] = usePutRequest<ISaveFaktumBody, IQuizState>(
    "soknad/faktum/save",
    true,
  );

  // Orkestrator
  const [saveAnswer, saveAnswerStatus] = usePutRequest<
    ISaveOrkestratorAnswerBody,
    IOrkestratorState
  >("orkestrator/save", true);

  // Quiz
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

  // Quiz
  async function saveGeneratorFaktumToQuiz(
    faktum: IQuizGeneratorFaktum,
    svar: QuizFaktum[][] | null,
  ) {
    const response = await saveFaktum({ uuid, faktum, svar });
    if (response) {
      setQuizState(response);
    }
  }

  // Orkestrator
  async function saveOpplysningToOrkestrator(
    opplysningId: string,
    type: OrkestratorOpplysningType,
    verdi: QuizFaktumSvarType,
  ) {
    if (isLoading) {
      setIsLocked(true);
      return;
    }

    setIsLoading(true);
    const response = await saveAnswer({ uuid, opplysningId, type, verdi });

    if (response) {
      setOrkestratorState(response);
    }

    setIsLocked(false);
    setIsLoading(false);
  }

  return (
    <SoknadContext.Provider
      value={{
        quizState,
        orkestratorState,
        saveFaktumToQuiz,
        saveGeneratorFaktumToQuiz,
        saveOpplysningToOrkestrator,
        isLoading: saveFaktumStatus === "pending" || saveAnswerStatus === "pending",
        isError: saveFaktumStatus === "error" || saveAnswerStatus === "error",
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
