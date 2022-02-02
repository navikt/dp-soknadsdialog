import {
  PrimitivFaktumType,
  GeneratorFaktumType,
  GeneratorListType,
  ValgFaktumType,
} from "../types/faktum.types";

export interface SanitySeksjon {
  _id: string;
  _type: "seksjon";
  key: string;
  faktum: SanityRef<SanityFaktum>[];
}

export interface SanityBaseDocument {
  _id: string;
  _type: string;
}

export type SanityFaktum = SanityBaseFaktum | SanityGeneratorFaktum | SanityValgFaktum;

export interface SanityBaseFaktum {
  _id: string;
  _type: "baseFaktum";
  key: string;
  type: PrimitivFaktumType;
  requiredAnswerIds?: SanityRef<SanityFaktum>[];
}

export interface SanityGeneratorFaktum {
  _id: string;
  _type: "generatorFaktum";
  key: string;
  type: GeneratorFaktumType;
  listType: GeneratorListType;
  faktum: SanityRef<SanityFaktum>[];
  requiredAnswerIds?: SanityRef<SanityFaktum>[];
}

export interface SanityValgFaktum {
  _id: string;
  _type: "valgFaktum";
  key: string;
  type: ValgFaktumType;
  answerOptions: SanityRef<SanityAnswerOption>[];
  subFaktum: SanityRef<SanityFaktum>[];
  requiredAnswerIds?: SanityRef<SanityFaktum>[];
}

export interface SanityAnswerOption {
  _id: string;
  _type: "answerOption";
  key: string;
}

// T only used to identify ref type when reading code
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface SanityRef<T = unknown> {
  _type: "reference";
  _ref: string;
  _key: string;
}
