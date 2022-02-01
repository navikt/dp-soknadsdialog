import { SubFaktum } from "../sanity/utils";
import {
  MockDataFaktum,
  MockDataGeneratorFaktum,
  MockDataValgFaktum,
} from "../soknad-fakta/soknad";
import { ValgFaktumType, PrimitivFaktumType, GeneratorFaktumType } from "./faktum.types";

export interface QuizFaktum {
  id: string;
  beskrivendeId: string;
  type: ValgFaktumType | PrimitivFaktumType | GeneratorFaktumType;
  svaralternativer?: QuizSvaralternativ[];
  svar?: QuizSvar[];
}

export interface QuizSvaralternativ {
  id: string;
  beskrivendeId: string;
}

export type QuizSvar = QuizSvaralternativ | Date | number | string;
