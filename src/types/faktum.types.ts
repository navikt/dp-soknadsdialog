import { BaseFaktumType, GeneratorFaktumType, ValgFaktumType } from "./types";

export type IFaktum = IPrimitivFaktum | IValgFaktum | IGeneratorFaktum;

export interface IBaseFaktum {
  id: string;
  title: string;
  description?: string;
  helpText?: string;
  alertText?: string;
}

export interface IPrimitivFaktum extends IBaseFaktum {
  type: BaseFaktumType;
}
export interface IValgFaktum extends IBaseFaktum {
  type: ValgFaktumType;
  answerOptions: IAnswerOption[];
  subFaktum?: ISubFaktum[];
}
export interface IGeneratorFaktum extends IBaseFaktum {
  type: GeneratorFaktumType;
  faktum: IFaktum[];
  // TODO: svar: Svar fra quiz ?
}

export type ISubFaktum = IFaktum & {
  requiredAnswerIds: { id: string }[];
}

export interface IAnswerOption {
  id: string;
  title: string;
  helpText?: string;
  alertText?: string;
}
