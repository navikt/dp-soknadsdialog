import React, { createContext, PropsWithChildren, useState } from "react";
import { usePutRequest } from "../hooks/request/usePutRequest";
import { useUuid } from "../hooks/useUuid";
import { ISaveOrkestratorAnswerBody } from "../pages/api/orkestrator/save";
import { ISaveFaktumBody } from "../pages/api/soknad/faktum/save";
import {
  ILandgruppe,
  IOrkestratorSoknad,
  OrkestratorOpplysningType,
} from "../types/orkestrator.types";
import {
  IQuizGeneratorFaktum,
  IQuizState,
  QuizFaktum,
  QuizFaktumSvarType,
} from "../types/quiz.types";

export interface IQuizContext {
  soknadState: IQuizState;
  orkestratorState: IOrkestratorSoknad | null;
  landgrupper: ILandgruppe[] | null;
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
  orkestratorState?: IOrkestratorSoknad;
  landgrupper: ILandgruppe[] | null;
}

export const QuizContext = createContext<IQuizContext | undefined>(undefined);

function QuizProvider(props: PropsWithChildren<IProps>) {
  const { uuid } = useUuid();
  const [soknadState, setSoknadState] = useState<IQuizState>(props.quizState);
  const [orkestratorState, setOrkestratorState] = useState<IOrkestratorSoknad | null>(
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
    IOrkestratorSoknad
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
      setSoknadState(response);
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
      setSoknadState(response);
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
    <QuizContext.Provider
      value={{
        soknadState,
        orkestratorState,
        landgrupper: props.landgrupper,
        saveFaktumToQuiz,
        saveGeneratorFaktumToQuiz,
        saveOpplysningToOrkestrator,
        isLoading: saveFaktumStatus === "pending" || saveAnswerStatus === "pending",
        isError: saveFaktumStatus === "error" || saveAnswerStatus === "error",
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
