export type OrkestratorSpørsmalType = "land" | "periode" | "dato" | "tekst" | "boolean";

export interface IOrkestratorSpørsmal {
  id: string;
  tekstnøkkel: string;
  type: OrkestratorSpørsmalType;
  svar: any;
  gyldigeSvar: any;
}

export interface IOrkestratorState {
  navn: string;
  nesteSpørsmål: IOrkestratorSpørsmal;
  besvarteSpørsmål: IOrkestratorSpørsmal[];
  erFullført: boolean;
}
