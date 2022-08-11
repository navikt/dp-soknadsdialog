export interface Documents {
  id: string;
  list: DocumentListItem[];
}

export interface DocumentListItem {
  id: string;
  beskrivendeId: string;
  files?: string[];
}

export interface UploadedFile {
  urn: string;
  filnavn: string;
}

export interface FileState {
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
