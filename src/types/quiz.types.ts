export type QuizFaktum =
  | QuizFlervalgFaktum
  | QuizValgFaktum
  | QuizTekstFaktum
  | QuizDatoFaktum
  | QuizPeriodeFaktum
  | QuizNumberFaktum
  | QuizLandFaktum;

export interface QuizBaseFaktum {
  id: string;
  beskrivendeId: string;
}

export interface QuizFlervalgFaktum extends QuizBaseFaktum {
  svar?: string[];
  type: "flervalg";
  gyldigeValg: string[];
}

export interface QuizValgFaktum extends QuizBaseFaktum {
  svar?: string;
  type: "boolean" | "envalg";
  gyldigeValg: string[];
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

export interface QuizLandFaktum extends QuizBaseFaktum {
  type: "land";
  svar: string;
}

export interface QuizGeneratorFaktum extends QuizBaseFaktum {
  type: "generator";
  svar?: QuizFaktum[][];
  templates: Omit<QuizFaktum, "svar">[];
}

export interface QuizSeksjon {
  beskrivendeId: string;
  fakta: (QuizFaktum | QuizGeneratorFaktum)[];
}

export interface QuizFaktumAnswerPayload {
  id: string;
  beskrivendeId: string;
  type: string;
  svar: QuizFaktumAnswerType;
}

export interface QuizPeriodeFaktumAnswerType {
  fom: string;
  tom?: string;
}

export type QuizFaktumAnswerType =
  | string[]
  | string
  | boolean
  | number
  | QuizPeriodeFaktumAnswerType
  | undefined;
