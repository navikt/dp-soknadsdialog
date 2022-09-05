import { useRouter } from "next/router";
import React, { createContext, PropsWithChildren, useState } from "react";
import { getNesteFaktum } from "../api/client/getNesteFaktum-api";
import { saveFaktum } from "../api/client/saveFaktumToQuiz-api";
import { IQuizState } from "../localhost-data/quiz-state-response";
import { ErrorTypesEnum } from "../types/error.types";
import { IQuizGeneratorFaktum, QuizFaktum, QuizFaktumSvarType } from "../types/quiz.types";

export interface IQuizContext {
  soknadState: IQuizState;
  saveFaktumToQuiz: (faktum: QuizFaktum, svar: QuizFaktumSvarType) => void;
  saveGeneratorFaktumToQuiz: (faktum: IQuizGeneratorFaktum, svar: QuizFaktum[][]) => void;
  isLoading: boolean;
  isError: boolean;
  errorType: ErrorTypesEnum;
}

export const QuizContext = createContext<IQuizContext | undefined>(undefined);

interface IProps {
  initialState: IQuizState;
}

function QuizProvider(props: PropsWithChildren<IProps>) {
  const router = useRouter();
  const { uuid } = router.query;
  const [soknadState, setSoknadState] = useState<IQuizState>(props.initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorType, setErrorType] = useState<ErrorTypesEnum>(ErrorTypesEnum.GenericError);

  async function saveFaktumToQuiz(faktum: QuizFaktum, svar: QuizFaktumSvarType) {
    try {
      setIsError(false);
      setIsLoading(true);
      const res = await saveFaktum(uuid, faktum, svar);
      await getNeste(res.sistBesvart);
      setIsLoading(false);
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error("Lagre faktum error: ", error);
      setIsLoading(false);
      setIsError(true);
      setErrorType(ErrorTypesEnum.SaveFaktumError);
    }
  }

  async function saveGeneratorFaktumToQuiz(faktum: IQuizGeneratorFaktum, svar: QuizFaktum[][]) {
    try {
      setIsError(false);
      setIsLoading(true);
      const res = await saveFaktum(uuid, faktum, svar);
      await getNeste(res.sistBesvart);
      setIsLoading(false);
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error("Lagre faktum error: ", error);
      setIsLoading(false);
      setIsError(true);
      setErrorType(ErrorTypesEnum.GenericError);
    }
  }

  async function getNeste(sistBesvart: string) {
    try {
      const quizState: IQuizState = await getNesteFaktum(uuid, sistBesvart);
      setSoknadState(quizState);
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error("GET NESTE ERROR: ", error);
      setIsError(true);
      setErrorType(ErrorTypesEnum.GetNesteError);
    }
  }

  return (
    <QuizContext.Provider
      value={{
        soknadState,
        saveFaktumToQuiz,
        saveGeneratorFaktumToQuiz,
        isLoading,
        isError,
        errorType,
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
