import { GeneratorFaktumType, PrimitivFaktumType, ValgFaktumType } from "./faktum.types";

export type QuizFaktumSvar = string | string[] | boolean | number;
export type QuizFaktum = QuizPrimitiveFaktum | QuizGeneratorFaktum;

export interface QuizBaseFaktum {
  id: string;
  beskrivendeId: string;
  gyldigeValg?: string[];
}

export interface QuizPrimitiveFaktum extends QuizBaseFaktum {
  type: PrimitivFaktumType | ValgFaktumType;
  svar?: QuizFaktumSvar;
}

export interface QuizGeneratorFaktum extends QuizBaseFaktum {
  type: GeneratorFaktumType;
  svar?: QuizPrimitiveFaktum[][];
  templates: QuizGeneratorTemplate[];
}

interface QuizGeneratorTemplate {
  id: string;
  type: PrimitivFaktumType | ValgFaktumType;
  beskrivendeId: string;
}

export interface QuizAnswer {
  id: string;
  beskrivendeId: string;
  type: string;
  svar: QuizAnswerValue;
}

export type QuizAnswerValue = string | string[] | number | boolean | QuizAnswerPeriod | undefined;

export interface QuizAnswerPeriod {
  fom: string;
  tom?: string;
}
