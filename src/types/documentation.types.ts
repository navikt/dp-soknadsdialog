import { QuizFaktum } from "./quiz.types";

export interface IDokumentkravList {
  soknad_uuid: string;
  krav: IDokumentkrav[];
}

export interface IDokumentkrav {
  id: string;
  beskrivendeId: string;
  fakta: QuizFaktum[];
  filer: IDokumentkravFil[];
  gyldigeValg: string[];
  svar?: string;
  begrunnelse?: string;
  bundle?: string;
}

export interface IDokumentkravFil {
  filsti: string;
  filnavn: string;
  urn: string;
  tidspunkt: string;
  storrelse: number;
}

export interface IFileState {
  id: string;
  name?: string;
  state?: FileHandleState;
  file?: File;
  error?: ErrorType;
  urn?: string;
  filsti?: string;
}

export enum FileHandleState {
  AwaitingUpload,
  Uploaded,
  Error,
}

export enum ErrorType {
  FileFormat,
  FileSize,
  ServerError,
}
