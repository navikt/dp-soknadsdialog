import React, { createContext, PropsWithChildren, useState } from "react";
import { usePutRequest } from "../hooks/request/usePutRequest";
import { useUuid } from "../hooks/useUuid";
import { ISaveFaktumBody } from "../pages/api/soknad/faktum/save";
import { QuizFaktum, QuizFaktumSvarType } from "../types/quiz.types";

export type SpørsmålTypes = "LAND" | "PERIODE" | "DATO" | "TEKST" | "BOOLEAN";

export interface ISpørsmal {
  id: string;
  tekstnøkkel: string;
  type: SpørsmålTypes;
  /* eslint-disable */
  svar: any;
  gyldigeSvar: any;
  /* eslint-enable */
}

export interface ISpørsmålGruppe {
  id: number;
  navn: string;
  nesteSpørsmål: ISpørsmal;
  besvarteSpørsmål: ISpørsmal[];
  erFullført: boolean;
}

export interface IOrkestratorContext {
  orkestratorState: ISpørsmålGruppe;
  saveOkestratorSvar: (faktum: QuizFaktum, svar: QuizFaktumSvarType) => void;
  isLoading: boolean;
  isError: boolean;
  isLocked: boolean;
}

interface IProps {
  initialState: ISpørsmålGruppe;
}

export const OrkestratorContext = createContext<IOrkestratorContext | undefined>(undefined);

function OrkestratorProvider(props: PropsWithChildren<IProps>) {
  const { uuid } = useUuid();
  const [orkestratorState, setOrkestratorState] = useState<ISpørsmålGruppe>(props.initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [saveOrkestratorSvar, saveOrkestratorSvarStatus] = usePutRequest<
    ISaveFaktumBody,
    ISpørsmålGruppe
  >("soknad/faktum/save", true);

  async function saveOkestratorSvar(faktum: QuizFaktum, svar: QuizFaktumSvarType) {
    if (isLoading) {
      setIsLocked(true);
      return;
    }

    setIsLoading(true);
    const response = await saveOrkestratorSvar({ uuid, faktum, svar });

    if (response) {
      setOrkestratorState(response);
    }

    setIsLocked(false);
    setIsLoading(false);
  }

  return (
    <OrkestratorContext.Provider
      value={{
        orkestratorState,
        saveOkestratorSvar,
        isLoading: saveOrkestratorSvarStatus === "pending",
        isError: saveOrkestratorSvarStatus === "error",
        isLocked,
      }}
    >
      {props.children}
    </OrkestratorContext.Provider>
  );
}

function useOrkestrator() {
  const context = React.useContext(OrkestratorContext);
  if (context === undefined) {
    throw new Error("useOrkestrator must be used within a QuizProvider");
  }
  return context;
}

export { OrkestratorProvider, useOrkestrator };
