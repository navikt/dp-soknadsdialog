import React, { createContext, PropsWithChildren, useState } from "react";
import { IQuizState } from "../localhost-data/quiz-state-response";
import { useRouter } from "next/router";
import api from "../api.utils";
import { QuizFaktum, QuizFaktumSvarType, IQuizGeneratorFaktum } from "../types/quiz.types";

export interface IQuizContext {
  soknadState: IQuizState;
  saveFaktumToQuiz: (faktum: QuizFaktum, svar: QuizFaktumSvarType) => void;
  saveGeneratorFaktumToQuiz: (faktum: IQuizGeneratorFaktum, svar: QuizFaktum[][]) => void;
  isLoading: boolean;
  isError: boolean;
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

  async function saveFaktumToQuiz(faktum: QuizFaktum, svar: QuizFaktumSvarType) {
    try {
      setIsError(false);
      setIsLoading(true);

      await fetch(api(`/soknad/${uuid}/faktum/${faktum.id}`), {
        method: "PUT",
        body: JSON.stringify({ ...faktum, svar }),
      });

      await getNeste();
      setIsLoading(false);
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error("Lagre faktum error: ", error);
      setIsLoading(false);
      setIsError(true);
    }
  }

  async function saveGeneratorFaktumToQuiz(faktum: IQuizGeneratorFaktum, svar: QuizFaktum[][]) {
    try {
      setIsError(false);
      setIsLoading(true);

      await fetch(api(`/soknad/${uuid}/faktum/${faktum.id}`), {
        method: "PUT",
        body: JSON.stringify({ ...faktum, svar }),
      });

      await getNeste();
      setIsLoading(false);
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error("Lagre faktum error: ", error);
      setIsLoading(false);
      setIsError(true);
    }
  }

  async function getNeste() {
    // throw new Error("FEIL I QUIZ");
    try {
      const nesteResponse = await fetch(api(`/soknad/${uuid}/neste`));
      const quizState = await nesteResponse.json();
      setSoknadState(quizState);
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error("GET NESTE ERROR: ", error);
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
