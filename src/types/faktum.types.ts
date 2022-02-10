import { TypedObject } from "@portabletext/types";
export type ValgFaktumType = "boolean" | "valg" | "dropdown" | "flervalg";
export type PrimitivFaktumType = "int" | "double" | "localdate" | "periode" | "tekst";
export type GeneratorFaktumType = "generator";
export type GeneratorListType = "Arbeidsforhold" | "Barn" | "Standard";
export type FaktumType = PrimitivFaktumType | ValgFaktumType | GeneratorFaktumType;

export type IFaktum = IPrimitivFaktum | IValgFaktum | IGeneratorFaktum;

export interface IBaseFaktum {
  id: string;
  title: string;
  description?: TypedObject | TypedObject[];
  helpText?: string;
  alertText?: string;
}

export interface IPrimitivFaktum extends IBaseFaktum {
  type: PrimitivFaktumType;
}
export interface IValgFaktum extends IBaseFaktum {
  type: ValgFaktumType;
  answerOptions: IAnswerOption[];
  subFaktum?: ISubFaktum[];
}
export interface IGeneratorFaktum extends IBaseFaktum {
  type: GeneratorFaktumType;
  listType: GeneratorListType;
  faktum: IFaktum[];
  // TODO: svar: Svar fra quiz ?
}

export type ISubFaktum = IFaktum & {
  requiredAnswerIds: { id: string }[];
};

export interface IAnswerOption {
  id: string;
  title: string;
  helpText?: string;
  alertText?: string;
}
