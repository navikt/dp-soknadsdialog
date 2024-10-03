export type OrkestratorOpplysningType = "land" | "periode" | "dato" | "tekst" | "boolean";

export interface IOpplysning {
  opplysningId: string;
  tekstnøkkel: string;
  type: OrkestratorOpplysningType;
  svar: any;
  gyldigeSvar: any;
}

export interface IOrkestratorState {
  navn: string;
  nesteUbesvarteOpplysning: IOpplysning;
  besvarteOpplysninger: IOpplysning[];
  erFullført: boolean;
}
