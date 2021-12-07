import { Quiz } from "./quiz";

export interface Seksjon {
  id: string;
  titleKey: string;
  descriptionKey?: string;
  helpTextKey?: string;
  faktum: Faktum[];
}

export interface Faktum {
  id: string;
  type: Quiz.DataType;
  titleKey: string;
  descriptionKey?: string;
  helpTextKey?: string;
  alertTextKey?: string;
  subFaktums?: SubFaktum[];
  answerOptions: Option[];
}

export interface SubFaktum extends Faktum {
  requiredAnswerId: string;
}

export interface Option {
  id: string;
  textKey: string;
  alert?: OptionAlert
}

export interface OptionAlert {
  id: string;
  textKey: string;
}
