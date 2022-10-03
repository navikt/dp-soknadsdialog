export type QuizFaktum =
  | IQuizBooleanFaktum
  | IQuizFlervalgFaktum
  | IQuizEnvalgFaktum
  | IQuizTekstFaktum
  | IQuizDatoFaktum
  | IQuizPeriodeFaktum
  | IQuizNumberFaktum
  | IQuizLandFaktum;

export interface IQuizBaseFaktum {
  id: string;
  beskrivendeId: string;
  readOnly: boolean;
  roller?: string[];
  sannsynliggjøresAv?: QuizFaktum[];
}

export interface IQuizFlervalgFaktum extends IQuizBaseFaktum {
  type: "flervalg";
  gyldigeValg: string[];
  svar?: string[];
}

export interface IQuizBooleanFaktum extends IQuizBaseFaktum {
  type: "boolean";
  gyldigeValg: string[];
  svar?: boolean;
}

export interface IQuizEnvalgFaktum extends IQuizBaseFaktum {
  type: "envalg";
  gyldigeValg: string[];
  svar?: string;
}

export interface IQuizTekstFaktum extends IQuizBaseFaktum {
  type: "tekst";
  svar?: string;
}

export interface IQuizDatoFaktum extends IQuizBaseFaktum {
  type: "localdate";
  svar?: string;
}

export interface IQuizPeriodeFaktum extends IQuizBaseFaktum {
  type: "periode";
  svar?: IQuizPeriodeFaktumAnswerType;
}

export interface IQuizNumberFaktum extends IQuizBaseFaktum {
  type: "int" | "double";
  svar?: number;
}

interface IQuizLandGruppe {
  gruppeId: string;
  land: string[];
}

export interface IQuizLandFaktum extends IQuizBaseFaktum {
  type: "land";
  grupper: IQuizLandGruppe[];
  gyldigeLand: string[];
  svar?: string;
}

export interface IQuizGeneratorFaktum extends IQuizBaseFaktum {
  type: "generator";
  svar?: QuizFaktum[][];
  templates: Omit<QuizFaktum, "readOnly">[];
}

export interface IQuizSeksjon {
  beskrivendeId: string;
  ferdig: boolean;
  fakta: (QuizFaktum | IQuizGeneratorFaktum)[];
}

export interface IQuizPeriodeFaktumAnswerType {
  fom: string;
  tom?: string;
}

export type QuizFaktumSvarType =
  | string[]
  | string
  | boolean
  | number
  | IQuizPeriodeFaktumAnswerType
  | undefined;
