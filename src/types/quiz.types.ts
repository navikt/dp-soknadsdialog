export type QuizFaktum =
  | QuizBooleanFaktum
  | QuizFlervalgFaktum
  | QuizEnvalgFaktum
  | QuizTekstFaktum
  | QuizDatoFaktum
  | QuizPeriodeFaktum
  | QuizNumberFaktum
  | QuizLandFaktum;

export interface QuizBaseFaktum {
  id: string;
  beskrivendeId: string;
  readOnly: boolean;
}

export interface QuizFlervalgFaktum extends QuizBaseFaktum {
  type: "flervalg";
  gyldigeValg: string[];
  svar?: string[];
}

export interface QuizBooleanFaktum extends QuizBaseFaktum {
  type: "boolean";
  gyldigeValg: string[];
  svar?: boolean;
}

export interface QuizEnvalgFaktum extends QuizBaseFaktum {
  type: "envalg";
  gyldigeValg: string[];
  svar?: string;
}

export interface QuizTekstFaktum extends QuizBaseFaktum {
  type: "tekst";
  svar?: string;
}

export interface QuizDatoFaktum extends QuizBaseFaktum {
  type: "localdate";
  svar?: string;
}

export interface QuizPeriodeFaktum extends QuizBaseFaktum {
  type: "periode";
  svar?: {
    fom: string;
    tom?: string;
  };
}

export interface QuizNumberFaktum extends QuizBaseFaktum {
  type: "int" | "double";
  svar?: number;
}

interface QuizLandGruppe {
  gruppeId: string;
  land: string[];
}

export interface QuizLandFaktum extends QuizBaseFaktum {
  type: "land";
  grupper: QuizLandGruppe[];
  gyldigeLand: string[];
  svar?: string;
}

export interface QuizGeneratorFaktum {
  id: string;
  beskrivendeId: string;
  type: "generator";
  svar?: QuizFaktum[][];
  templates: Omit<QuizFaktum, "readOnly">[];
}

export interface QuizSeksjon {
  beskrivendeId: string;
  fakta: (QuizFaktum | QuizGeneratorFaktum)[];
}

export interface QuizPeriodeFaktumAnswerType {
  fom: string;
  tom?: string;
}

export type QuizFaktumSvarType =
  | string[]
  | string
  | boolean
  | number
  | QuizPeriodeFaktumAnswerType
  | undefined;
