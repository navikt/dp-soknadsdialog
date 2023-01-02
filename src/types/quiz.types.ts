export type QuizFaktum =
  | IQuizBooleanFaktum
  | IQuizFlervalgFaktum
  | IQuizEnvalgFaktum
  | IQuizTekstFaktum
  | IQuizDatoFaktum
  | IQuizPeriodeFaktum
  | IQuizNumberFaktum
  | IQuizLandFaktum;

export type QuizProsess = "Dagpenger" | "Innsending";

export interface IQuizState {
  ferdig: boolean;
  seksjoner: IQuizSeksjon[];
  roller?: string[];
  antallSeksjoner: number;
  versjon_navn?: QuizProsess;
}

export interface IQuizBaseFaktum {
  id: string;
  beskrivendeId: string;
  readOnly: boolean;
  roller?: string[];
  sannsynliggjoresAv?: QuizFaktum[];
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
  svar?: string | null;
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
  tom?: string | null;
}

export type QuizFaktumSvarType =
  | string[]
  | string
  | boolean
  | number
  | IQuizPeriodeFaktumAnswerType
  | undefined
  | null;

export interface IPaabegyntSoknad {
  soknadUuid: string;
  opprettet: string;
  sistEndretAvbruker?: string;
}

export interface IInnsentSoknad {
  soknadUuid: string;
  forstInnsendt: string;
}

export interface IMineSoknader {
  paabegynt?: IPaabegyntSoknad;
  innsendte?: IInnsentSoknad[];
}

export type ISoknadStatuser =
  | "Paabegynt"
  | "UnderBehandling"
  | "FerdigBehandlet"
  | "ManglerDokumenter"
  | "Ukjent";

export interface ISoknadStatus {
  status: ISoknadStatuser;
  opprettet?: string;
  innsendt?: string;
}
