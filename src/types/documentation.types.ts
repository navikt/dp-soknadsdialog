export interface IDokumentkravListe {
  soknad_uuid: string;
  krav: IDokumentkrav[];
}

export interface IDokumentkrav {
  id: string;
  beskrivendeId: string;
  filer?: IDokumentkravFil[];
  gyldigeValg: string[];
  svar?: string;
}

export interface IDokumentkravFil {
  filnavn: string;
  urn: string;
  timestamp: string;
}

export interface IFileState {
  id: string;
  name?: string;
  state?: FileHandleState;
  file?: File;
  error?: ErrorType;
  urn?: string;
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
