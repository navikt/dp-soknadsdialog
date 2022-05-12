import React, { createContext, PropsWithChildren, useState } from "react";
import { QuizState } from "../localhost-data/quiz-state-response";
import { useRouter } from "next/router";
import api from "../api.utils";

export interface QuizContext {
  soknadState: QuizState;
  saveFaktumToQuiz: (id: string, payload: unknown) => void;
  isLoading: boolean;
  isError: boolean;
}

export const QuizContext = createContext<QuizContext | undefined>(undefined);

interface Props {
  initialState: QuizState;
}

function QuizProvider(props: PropsWithChildren<Props>) {
  const router = useRouter();
  const { uuid } = router.query;
  const [soknadState, setSoknadState] = useState<QuizState>(props.initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function saveFaktumToQuiz(id: string, payload: unknown) {
    try {
      setIsError(false);
      setIsLoading(true);

      await fetch(api(`/soknad/${uuid}/faktum/${id}`), {
        method: "PUT",
        body: JSON.stringify(payload),
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
      value={{ soknadState, saveFaktumToQuiz: saveFaktumToQuiz, isLoading, isError }}
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
