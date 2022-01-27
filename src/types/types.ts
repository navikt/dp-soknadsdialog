import { SubFaktum } from "../sanity/utils";
import {
  MockDataFaktum,
  MockDataGeneratorFaktum,
  MockDataValgFaktum,
} from "../soknad-fakta/soknad";

export type ValgFaktumType = "boolean" | "valg" | "dropdown" | "flervalg";
export type BaseFaktumType = "int" | "double" | "localdate" | "periode" | "tekst";
export type GeneratorFaktumType = "generator";
export type GeneratorListType = "Arbeidsforhold" | "Barn" | "Standard";
export type FaktumType = BaseFaktumType | ValgFaktumType | GeneratorFaktumType;

export interface QuizFaktum {
  id: string;
  beskrivendeId: string;
  type: ValgFaktumType | BaseFaktumType | GeneratorFaktumType;
  svaralternativer?: QuizSvaralternativ[];
  svar?: QuizSvar[];
}

export interface QuizSvaralternativ {
  id: string;
  beskrivendeId: string;
}

export type QuizSvar = QuizSvaralternativ | Date | number | string;

export function isValgFaktum(faktum: MockDataFaktum): faktum is MockDataValgFaktum {
  return (faktum as MockDataValgFaktum).answerOptions !== undefined;
}

export function isSubFaktum<T>(faktum: T): faktum is SubFaktum<T> {
  return (faktum as SubFaktum<T>).requiredAnswerIds !== undefined;
}

export function isGeneratorFaktum(faktum: MockDataFaktum): faktum is MockDataGeneratorFaktum {
  return (faktum as MockDataGeneratorFaktum).faktum !== undefined;
}
