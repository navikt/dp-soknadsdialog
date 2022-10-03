import { QuizFaktum } from "./quiz.types";
import {
  DOKUMENTKRAV_SVAR_SEND_NAA,
  DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE,
  DOKUMENTKRAV_SVAR_SENDER_IKKE,
  DOKUMENTKRAV_SVAR_SENDER_SENERE,
  DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE,
} from "../constants";

export interface IDokumentkravList {
  soknad_uuid: string;
  krav: IDokumentkrav[];
}

export type IDokumentkravSvar =
  | typeof DOKUMENTKRAV_SVAR_SEND_NAA
  | typeof DOKUMENTKRAV_SVAR_SENDER_SENERE
  | typeof DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE
  | typeof DOKUMENTKRAV_SVAR_SENDT_TIDLIGERE
  | typeof DOKUMENTKRAV_SVAR_SENDER_IKKE;

export interface IDokumentkrav {
  id: string;
  beskrivendeId: string;
  fakta: QuizFaktum[];
  filer: IDokumentkravFil[];
  gyldigeValg: IDokumentkravSvar[];
  svar?: IDokumentkravSvar;
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

export interface IDokumentkravChanges {
  svar?: IDokumentkravSvar;
  begrunnelse?: string;
  filer?: IDokumentkravFil[];
}
