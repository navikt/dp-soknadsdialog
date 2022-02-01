import { BaseFaktumType, GeneratorFaktumType, ValgFaktumType } from "./types";

export type IFaktum = IFaktumPrimitiv | IFaktumValg | IFaktumGenerator;

export interface IFaktumBase {
  id: string;
  title: string;
  description?: string;
  helpText?: string;
  alertText?: string;
  
}

export interface IFaktumPrimitiv extends IFaktumBase {
  type: BaseFaktumType;
}
export interface IFaktumValg extends IFaktumBase {
  type: ValgFaktumType;
  answerOptions: IAnswerOption[];
  subFaktum?: ISubFaktum[];
}
export interface IFaktumGenerator extends IFaktumBase {
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
