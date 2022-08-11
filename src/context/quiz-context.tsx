import React, { createContext, PropsWithChildren, useState } from "react";
import { QuizState } from "../localhost-data/quiz-state-response";
import { useRouter } from "next/router";
import api from "../api.utils";
import { QuizFaktum, QuizFaktumSvarType, QuizGeneratorFaktum } from "../types/quiz.types";

export interface QuizContext {
  soknadState: QuizState;
  saveFaktumToQuiz: (faktum: QuizFaktum, svar: QuizFaktumSvarType) => void;
  saveGeneratorFaktumToQuiz: (faktum: QuizGeneratorFaktum, svar: QuizFaktum[][]) => void;
  isLoading: boolean;
  isError: boolean;
  isSaved: boolean;
}

export enum SavingStateEnum {
  INITIAL = "INITIAL",
  SAVING = "SAVING",
  SAVED = "SAVED",
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
  const [isSaved, setIsSaved] = useState(false);
  const [isError, setIsError] = useState(false);

  async function saveFaktumToQuiz(faktum: QuizFaktum, svar: QuizFaktumSvarType) {
    try {
      setIsError(false);
      setIsLoading(true);
      setIsSaved(false);

      await fetch(api(`/soknad/${uuid}/faktum/${faktum.id}`), {
        method: "PUT",
        body: JSON.stringify({ ...faktum, svar }),
      });

      await getNeste();
      setIsLoading(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error("Lagre faktum error: ", error);
      setIsLoading(false);
      setIsError(true);
    }
  }

  async function saveGeneratorFaktumToQuiz(faktum: QuizGeneratorFaktum, svar: QuizFaktum[][]) {
    try {
      setIsError(false);
      setIsLoading(true);
      setIsSaved(true);

      await fetch(api(`/soknad/${uuid}/faktum/${faktum.id}`), {
        method: "PUT",
        body: JSON.stringify({ ...faktum, svar }),
      });

      await getNeste();
      setIsLoading(false);
      setIsSaved(false);
      setTimeout(() => setIsSaved(false), 2500);
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
        isSaved,
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
