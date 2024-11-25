export type OrkestratorOpplysningType = "land" | "periode" | "dato" | "tekst" | "boolean";

export type OrkestratorOpplysningSvarType =
  | string[]
  | string
  | boolean
  | number
  | IPeriodType
  | undefined
  | null;

export interface IPeriodType {
  fom: string;
  tom?: string;
}

export interface IOpplysning {
  opplysningId: string;
  tekstnøkkel: string;
  type: OrkestratorOpplysningType;
  svar?: OrkestratorOpplysningSvarType;
  gyldigeSvar: any;
}

export interface IOrkestratorSeksjon {
  navn: string;
  nesteUbesvarteOpplysning: IOpplysning;
  besvarteOpplysninger: IOpplysning[];
  erFullført: boolean;
}

export interface IOrkestratorSoknad {
  søknadId: string;
  seksjoner: IOrkestratorSeksjon[];
  erFullført: boolean;
  antallSeksjoner: number;
}

export interface ILandgruppe {
  gruppenavn: string;
  gruppeId: string;
  land: string[];
}
