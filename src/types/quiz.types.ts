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
  templates?: GeneratorTemplate[];
}

interface GeneratorTemplate {
  id: string;
  type: PrimitivFaktumType | ValgFaktumType;
  beskrivendeId: string;
}
