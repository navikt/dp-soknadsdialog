import { TypedObject } from "@portabletext/types";
export type ValgFaktumType = "boolean" | "envalg" | "flervalg";
export type PrimitivFaktumType = "int" | "double" | "localdate" | "periode" | "tekst";
export type GeneratorFaktumType = "generator";
export type LandFaktumType = "land";
export type FaktumType = PrimitivFaktumType | ValgFaktumType | GeneratorFaktumType | LandFaktumType;

export type IFaktum = IPrimitivFaktum | IValgFaktum | IGeneratorFaktum | ILandFaktum;

export interface IBaseFaktum {
  id: string;
  textId: string;
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
  faktum: IFaktum[];
}
export interface ILandFaktum extends IBaseFaktum {
  type: LandFaktumType;
  subFaktum?: ISubFaktum[];
  countryGroups: never[]; // Todo: Correct type
}

export type ISubFaktum = IFaktum & {
  requiredAnswerIds: string[];
};

export interface IAnswerOption {
  textId: string;
  title: string;
  helpText?: string;
  alertText?: string;
}
