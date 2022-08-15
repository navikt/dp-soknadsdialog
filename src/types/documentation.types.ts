export interface IDokumentkravListe {
  id: string;
  list: IDokumentkrav[];
}

export interface IDokumentkrav {
  id: string;
  beskrivendeId: string;
  files?: string[];
}

export interface IUploadedFile {
  urn: string;
  filnavn: string;
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
